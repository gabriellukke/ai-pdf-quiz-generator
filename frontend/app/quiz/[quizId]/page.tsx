'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useGetQuizQuestions, useSubmitQuiz } from '@/queries/quiz/hooks';
import { QuizAnswer } from '@/queries/quiz/types';
import { QuizPageParams } from '@/types/common';
import { useQuizNavigation } from '@/hooks/useQuizNavigation';
import { LoadingState } from '@/components/LoadingState';
import { QuizHeader, QuizQuestion, QuizNavigation, QuizFeedback } from './_components';

export default function QuizPage({ params }: QuizPageParams) {
  const { quizId } = use(params);
  const router = useRouter();

  const { data, isLoading, isError } = useGetQuizQuestions(quizId);
  const submitMutation = useSubmitQuiz(quizId);

  const {
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    answeredCount,
    answers,
    navigation,
    currentAnswerState,
    handleNext: goToNext,
    handlePrevious,
    handleSelectAnswer,
    clearProgress,
  } = useQuizNavigation({ quizId, questions: data?.questions || [] });

  const { currentAnswer, isAnswered, isCorrect } = currentAnswerState;
  const { isLastQuestion, isFirstQuestion } = navigation;

  const handleNext = () => {
    if (isLastQuestion && isAnswered) {
      const submission: QuizAnswer[] = (data?.questions || []).map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id] || '',
      }));

      submitMutation.mutate({ answers: submission }, {
        onSuccess: () => {
          clearProgress();
          router.push(`/results/${quizId}`);
        },
      });
    } else if (!isLastQuestion) {
      goToNext();
    }
  };

  if (isLoading) {
    return <LoadingState title="Preparing Quiz for Practice" subtitle="Preparing the quiz so you can now pratice..." />;
  }

  if (isError || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Error loading quiz. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto px-4">
        <QuizHeader
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
        />

        <QuizQuestion
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          currentAnswer={currentAnswer}
          isAnswered={isAnswered}
          onSelectAnswer={handleSelectAnswer}
        />

        <div className="min-h-[80px] sm:min-h-[88px] mt-4 sm:mt-6 mb-4 sm:mb-6">
          {isAnswered && <QuizFeedback isCorrect={isCorrect} correctAnswer={currentQuestion.correct_answer} />}
        </div>

        <QuizNavigation
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          isAnswered={isAnswered}
          isSubmitting={submitMutation.isPending}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {submitMutation.isError && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded-lg animate-fade-in">
            <p className="text-sm text-red-700">Error submitting quiz. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

