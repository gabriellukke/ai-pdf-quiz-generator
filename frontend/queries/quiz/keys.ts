import { QueryKey } from '@tanstack/react-query';

export const QUIZ_QUERY_KEYS = {
  default: ['quiz'] as QueryKey,
  detail: (id: string) => [...QUIZ_QUERY_KEYS.default, id] as QueryKey,
  questions: (id: string) => [...QUIZ_QUERY_KEYS.default, 'questions', id] as QueryKey,
  results: (id: string) => [...QUIZ_QUERY_KEYS.default, 'results', id] as QueryKey,
};

