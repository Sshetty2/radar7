/* eslint-disable max-statements */
import {
  type UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamObject,
  streamText,
  stepCountIs
} from 'ai';
import { z } from 'zod/v3';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import {
  codePrompt,
  systemPrompt,
  updateDocumentPrompt
} from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveDocument,
  saveMessages,
  saveSuggestions
} from '@/lib/db/queries';
import type { Suggestion } from '@/lib/db/schema';
import { generateUUID } from '@/lib/utils';

export const maxDuration = 60;

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions'
];

const weatherTools: AllowedTools[] = ['getWeather'];

const allTools: AllowedTools[] = [...blocksTools, ...weatherTools];

// Add this new function to create a specialized system prompt with analysis data
function createAnalysisSystemPrompt (analysisResponse: any) {
  return `${systemPrompt}

For the purposes of chatting with the user, we have analyzed this historical figure: ${analysisResponse.name}

Key metrics and information about this person:
- World Impact: ${analysisResponse.worldly_impact_score}/100
- Reach: ${analysisResponse.reach_score}/100
- Innovation: ${analysisResponse.innovation_score}/100
- Influence: ${analysisResponse.influence_score}/100
- Controversy: ${analysisResponse.controversy_score}/100
- Longevity of Impact: ${analysisResponse.longevity_score}/100

JSON: ${JSON.stringify(analysisResponse)}

Instructions:
1. Use this data to provide informed, nuanced responses about ${analysisResponse.name}
2. Reference specific metrics when relevant to the discussion
3. Draw from the timeline_of_influence, major_contributions, and counter_narratives when appropriate
4. Cite sources when making specific claims
5. Be prepared to discuss both achievements and controversies
6. Consider the geographic and temporal context of their influence

Remember to maintain a balanced perspective, acknowledging both the figure's impacts and limitations.`;
}

export async function POST (request: Request) {
  const {
    id,
    messages,
    modelId
  }: { id: string; messages: UIMessage[]; modelId: string } = await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find(_ => _.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToModelMessages(messages);
  const userMessages = coreMessages.filter(message => message.role === 'user');
  const userMessage = userMessages.at(-1);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chatData = await getChatById({ id });

  if (!chatData) {
    return new Response('Chat not found. Analysis must be completed first.', { status: 400 });
  }

  const userMessageId = generateUUID();

  await saveMessages({
    messages: [
      {
        ...userMessage,
        id       : userMessageId,
        createdAt: new Date(),
        chatId   : id
      }
    ]
  });

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: 'data-user-message-id',
        id  : 'user-message-id',
        data: userMessageId
      });

      const result = streamText({
        model                   : customModel(model.apiIdentifier),
        system                  : systemPrompt,
        messages                : coreMessages,
        stopWhen                : stepCountIs(5),
        experimental_activeTools: allTools,

        tools: {
          getWeather: {
            description: 'Get the current weather at a location',
            inputSchema: z.object({
              latitude : z.number(),
              longitude: z.number()
            }),
            execute: async ({ latitude, longitude }) => {
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
              );

              const weatherData = await response.json();

              return weatherData;
            }
          },
          createDocument: {
            description:
              'Create a document for a writing activity. This tool will call other functions that will generate the contents of the document based on the title and kind.',
            inputSchema: z.object({
              title: z.string(),
              kind : z.enum(['text', 'code'])
            }),
            execute: async ({ title, kind }) => {
              const _id = generateUUID();
              let draftText = '';

              writer.write({
                type: 'data-id',
                id  : 'document-id',
                data: _id
              });

              writer.write({
                type: 'data-title',
                id  : 'document-title',
                data: title
              });

              writer.write({
                type: 'data-kind',
                id  : 'document-kind',
                data: kind
              });

              writer.write({
                type: 'data-clear',
                id  : 'document-clear',
                data: ''
              });

              if (kind === 'text') {
                const { fullStream } = streamText({
                  model: customModel(model.apiIdentifier),
                  system:
                    'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
                  prompt: title
                });

                for await (const delta of fullStream) {
                  const { type } = delta;

                  if (type === 'text-delta') {
                    const { text: textDelta } = delta;

                    draftText += textDelta;
                    writer.write({
                      type: 'data-text-delta',
                      id  : 'text-delta',
                      data: textDelta
                    });
                  }
                }

                writer.write({
                  type: 'data-finish',
                  id  : 'finish',
                  data: ''
                });
              } else if (kind === 'code') {
                const { fullStream } = streamObject({
                  model : customModel(model.apiIdentifier),
                  system: codePrompt,
                  prompt: title,
                  schema: z.object({ code: z.string() })
                });

                for await (const delta of fullStream) {
                  const { type } = delta;

                  if (type === 'object') {
                    const { object } = delta;
                    const { code } = object;

                    if (code) {
                      writer.write({
                        type: 'data-code-delta',
                        id  : 'code-delta',
                        data: code ?? ''
                      });

                      draftText = code;
                    }
                  }
                }

                writer.write({
                  type: 'data-finish',
                  id  : 'finish',
                  data: ''
                });
              }

              if (session.user?.id) {
                await saveDocument({
                  id,
                  title,
                  kind,
                  content: draftText,
                  userId : session.user.id
                });
              }

              return {
                id,
                title,
                kind,
                content:
                  'A document was created and is now visible to the user.'
              };
            }
          },
          updateDocument: {
            description: 'Update a document with the given description.',
            inputSchema: z.object({
              id         : z.string().describe('The ID of the document to update'),
              description: z
                .string()
                .describe('The description of changes that need to be made')
            }),
            execute: async ({ _id, description }) => {
              const document = await getDocumentById({ id: _id });

              if (!document) {
                return { error: 'Document not found' };
              }

              const { content: currentContent } = document;
              let draftText = '';

              writer.write({
                type: 'data-clear',
                id  : 'document-clear-update',
                data: document.title
              });

              if (document.kind === 'text') {
                const { fullStream } = streamText({
                  model          : customModel(model.apiIdentifier),
                  system         : updateDocumentPrompt(currentContent || '', 'text'),
                  prompt         : description,
                  providerOptions: {
                    openai: {
                      prediction: {
                        type   : 'content',
                        content: currentContent || ''
                      }
                    }
                  }
                });

                for await (const delta of fullStream) {
                  const { type } = delta;

                  if (type === 'text-delta') {
                    const { text: textDelta } = delta;

                    draftText += textDelta;
                    writer.write({
                      type: 'data-text-delta',
                      id  : 'text-delta',
                      data: textDelta
                    });
                  }
                }

                writer.write({
                  type: 'data-finish',
                  id  : 'finish',
                  data: ''
                });
              } else if (document.kind === 'code') {
                const { fullStream } = streamObject({
                  model : customModel(model.apiIdentifier),
                  system: updateDocumentPrompt(currentContent || '', 'code'),
                  prompt: description,
                  schema: z.object({ code: z.string() })
                });

                for await (const delta of fullStream) {
                  const { type } = delta;

                  if (type === 'object') {
                    const { object } = delta;
                    const { code } = object;

                    if (code) {
                      writer.write({
                        type: 'data-code-delta',
                        id  : 'code-delta',
                        data: code ?? ''
                      });

                      draftText = code;
                    }
                  }
                }

                writer.write({
                  type: 'data-finish',
                  id  : 'finish',
                  data: ''
                });
              }

              if (session.user?.id) {
                await saveDocument({
                  id,
                  title  : document.title,
                  content: draftText,
                  kind   : document.kind,
                  userId : session.user.id
                });
              }

              return {
                id,
                title  : document.title,
                kind   : document.kind,
                content: 'The document has been updated successfully.'
              };
            }
          },
          requestSuggestions: {
            description: 'Request suggestions for a document',
            inputSchema: z.object({
              documentId: z
                .string()
                .describe('The ID of the document to request edits')
            }),
            execute: async ({ documentId }) => {
              const document = await getDocumentById({ id: documentId });

              if (!document || !document.content) {
                return { error: 'Document not found' };
              }

              const suggestions: Omit<Suggestion, 'userId' | 'createdAt' | 'documentCreatedAt'>[] = [];

              const { elementStream } = streamObject({
                model: customModel(model.apiIdentifier),
                system:
                  'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
                prompt: document.content,
                output: 'array',
                schema: z.object({
                  originalSentence: z
                    .string()
                    .describe('The original sentence'),
                  suggestedSentence: z
                    .string()
                    .describe('The suggested sentence'),
                  description: z
                    .string()
                    .describe('The description of the suggestion')
                })
              });

              for await (const element of elementStream) {
                const suggestion = {
                  originalText : element.originalSentence,
                  suggestedText: element.suggestedSentence,
                  description  : element.description,
                  id           : generateUUID(),
                  documentId,
                  isResolved   : false
                };

                writer.write({
                  type: 'data-suggestion',
                  id  : 'suggestion',
                  data: suggestion
                });

                suggestions.push(suggestion);
              }

              if (session.user?.id) {
                const userId = session.user.id;

                await saveSuggestions({
                  suggestions: suggestions.map(suggestion => ({
                    ...suggestion,
                    userId,
                    createdAt        : new Date(),
                    documentCreatedAt: document.createdAt
                  }))
                });
              }

              return {
                id     : documentId,
                title  : document.title,
                kind   : document.kind,
                message: 'Suggestions have been added to the document'
              };
            }
          }
        },

        onFinish: async ({ response }) => {
          if (session.user?.id) {
            try {
              await saveMessages({
                messages: response.messages.map(
                  message => {
                    const messageId = generateUUID();

                    if (message.role === 'assistant') {
                      writer.write({
                        type: 'data-message-annotations',
                        id  : 'message-annotations',
                        data: { messageIdFromServer: messageId }
                      });
                    }

                    return {
                      id       : messageId,
                      chatId   : id,
                      role     : message.role,
                      content  : message.content,
                      createdAt: new Date()
                    };
                  }
                )
              });
            } catch (error) {
              console.error('Failed to save chat');
            }
          }
        },

        experimental_telemetry: {
          isEnabled : true,
          functionId: 'stream-text'
        }
      });

      writer.merge(result.toUIMessageStream());
    }
  });

  return createUIMessageStreamResponse({ stream });
}

export async function DELETE (request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', { status: 500 });
  }
}
