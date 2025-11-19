'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetQuizQuestions, useSubmitQuiz } from '@/queries/quiz/hooks';
import { QuizAnswer } from '@/queries/quiz/types';
import { QuizOption, QuizFeedback } from '@/components/quiz';

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data, isLoading, isError } = useGetQuizQuestions(quizId);
  const submitMutation = useSubmitQuiz(quizId);

  const questions = data?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const answeredCount = Object.keys(answers).length;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const isAnswered = !!currentAnswer;
  const isCorrect = isAnswered && currentAnswer === currentQuestion?.correct_answer;

  const handleSelectAnswer = (answer: string) => {
    if (!isAnswered) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));
    }
  };

  const handleNext = () => {
    if (isLastQuestion && isAnswered) {
      const submission: QuizAnswer[] = questions.map((q) => ({
        question_id: q.id,
        selected_answer: answers[q.id] || '',
      }));

      submitMutation.mutate(
        { answers: submission },
        {
          onSuccess: () => {
            router.push(`/results/${quizId}`);
          },
        },
      );
    } else if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
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
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <QuizOption
                key={index}
                option={option}
                isSelected={currentAnswer === option}
                isCorrect={option === currentQuestion.correct_answer}
                isAnswered={isAnswered}
                onSelect={() => handleSelectAnswer(option)}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[88px] mt-6 mb-6 flex items-start">
          {isAnswered && <QuizFeedback isCorrect={isCorrect} correctAnswer={currentQuestion.correct_answer} />}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="px-6 py-3 border-2 border-primary-500 rounded-lg font-medium text-primary-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered || submitMutation.isPending}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {submitMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>{isLastQuestion ? 'Finish' : 'Next'}</span>
                {!isLastQuestion && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </>
            )}
          </button>
        </div>

          {submitMutation.isError && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded-lg animate-fade-in">
              <p className="text-sm text-red-700">Error submitting quiz. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

