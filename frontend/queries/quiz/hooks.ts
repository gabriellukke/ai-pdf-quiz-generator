import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { QUIZ_QUERY_KEYS } from './keys';
import QuizApi from './requests';
import { QuizResponse, Question, QuizSubmission, QuizResult } from './types';
import { useUpdateQuestionsCache } from './updaters';

export const useGetQuizQuestions = (
  quizId: string,
  options?: Omit<UseQueryOptions<QuizResponse, Error>, 'queryKey' | 'queryFn'>,
): UseQueryResult<QuizResponse, Error> =>
  useQuery<QuizResponse, Error>({
    queryKey: QUIZ_QUERY_KEYS.questions(quizId),
    queryFn: () => QuizApi.getQuestions(quizId),
    ...options,
  });

export const useUploadPdf = (
  options?: Omit<UseMutationOptions<QuizResponse, Error, File>, 'mutationFn'>,
): UseMutationResult<QuizResponse, Error, File> => {
  return useMutation<QuizResponse, Error, File>({
    mutationFn: (file: File) => QuizApi.uploadPdf(file),
    ...options,
  });
};

export const useUpdateQuizQuestions = (
  quizId: string,
  options?: Omit<UseMutationOptions<QuizResponse, Error, Question[]>, 'mutationFn'>,
): UseMutationResult<QuizResponse, Error, Question[]> => {
  const { onSuccess, ...rest } = options || {};
  const updateQuestionsCache = useUpdateQuestionsCache();

  return useMutation<QuizResponse, Error, Question[]>({
    mutationFn: (questions: Question[]) => QuizApi.updateQuestions(quizId, questions),
    onSuccess: (...args) => {
      const [data] = args;
      updateQuestionsCache(quizId, data);
      if (onSuccess) {
        onSuccess(...args);
      }
    },
    ...rest,
  });
};

export const useSubmitQuiz = (
  quizId: string,
  options?: Omit<UseMutationOptions<QuizResult, Error, QuizSubmission>, 'mutationFn'>,
): UseMutationResult<QuizResult, Error, QuizSubmission> => {
  const { onSuccess, ...rest } = options || {};
  const queryClient = useQueryClient();

  return useMutation<QuizResult, Error, QuizSubmission>({
    mutationFn: (submission: QuizSubmission) => QuizApi.submitQuiz(quizId, submission),
    onSuccess: (...args) => {
      const [data] = args;
      queryClient.setQueryData(QUIZ_QUERY_KEYS.results(quizId), data);
      if (onSuccess) {
        onSuccess(...args);
      }
    },
    ...rest,
  });
};

