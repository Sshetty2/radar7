export const models = [
  {
    id           : 'gpt-4o-mini',
    label        : 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini'
  },
  {
    id           : 'gpt-4o',
    label        : 'GPT 4o',
    apiIdentifier: 'gpt-4o'
  }
] as const;

export const DEFAULT_MODEL_NAME = 'gpt-4o-mini';
