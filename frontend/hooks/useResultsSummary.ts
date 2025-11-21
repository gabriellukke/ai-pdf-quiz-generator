import { useMemo } from 'react';
import { useGetQuizResults, useGetQuizQuestions } from '@/queries/quiz/hooks';

export function useResultsSummary(quizId: string) {
  const {
    data: results,
    isLoading: isResultsLoading,
    isError: isResultsError,
  } = useGetQuizResults(quizId);

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
  } = useGetQuizQuestions(quizId, { enabled: Boolean(quizId) });

  const score = results?.score ?? 0;
  const total = results?.total ?? 0;
  const percentage = results?.percentage ?? 0;
  const incorrectAnswers = Math.max(total - score, 0);

  const feedbackMessage = useMemo(() => {
    if (percentage >= 90) return 'Outstanding work!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 50) return 'Nice effort!';
    return 'Keep practicing!';
  }, [percentage]);

  return {
    results,
    questionsData,
    score,
    total,
    percentage,
    incorrectAnswers,
    feedbackMessage,
    isLoading: isResultsLoading || isQuestionsLoading,
    isError: isResultsError,
  };
}

