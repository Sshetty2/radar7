import { openai } from '@ai-sdk/openai';

export const customModel = (apiIdentifier: string) => openai(apiIdentifier);
