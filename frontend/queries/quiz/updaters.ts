import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QuizResponse, QuizResult } from './types';
import { QUIZ_QUERY_KEYS } from './keys';

export const useUpdateQuestionsCache = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (quizId: string, data: QuizResponse) => {
      queryClient.setQueryData(QUIZ_QUERY_KEYS.questions(quizId), data);
    },
    [queryClient],
  );
};

export const useInvalidateQuestionsCache = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (quizId: string) => {
      queryClient.invalidateQueries({ queryKey: QUIZ_QUERY_KEYS.questions(quizId) });
    },
    [queryClient],
  );
};


