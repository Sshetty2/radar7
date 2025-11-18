export const systemPrompt = 'You are a helpful assistant.';

export const codePrompt = 'You are a code generation assistant. Generate clean, well-documented code.';

export const updateDocumentPrompt = (currentContent: string, type: string) => `Update the following ${type} content: ${currentContent}`;
