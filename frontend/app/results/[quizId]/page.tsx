'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { QUIZ_QUERY_KEYS } from '@/queries/quiz/keys';
import { QuizResult } from '@/queries/quiz/types';

export default function ResultsPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const results = queryClient.getQueryData<QuizResult>(QUIZ_QUERY_KEYS.results(quizId));

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      </div>
    );
  }

  const { score, total, percentage } = results;
  const passed = percentage >= 70;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <div className="mt-6">
              <div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${
                  passed ? 'bg-green-100' : 'bg-red-100'
                } mb-4`}
              >
                <span
                  className={`text-4xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}
                >
                  {percentage}%
                </span>
              </div>
              <p className="text-xl text-gray-700">
                You scored {score} out of {total}
              </p>
              {passed ? (
                <p className="text-green-600 font-medium mt-2">Great job! 🎉</p>
              ) : (
                <p className="text-amber-600 font-medium mt-2">Keep practicing! 💪</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Start New Quiz
            </button>
            <button
              onClick={() => router.push(`/quiz/${quizId}`)}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Review Answers</h2>

          {results.results.map((result, index) => (
            <div
              key={result.question_id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                result.is_correct ? 'border-green-200' : 'border-red-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    result.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {result.is_correct ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Question {index + 1}: {result.question}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">
                        Your answer:
                      </span>
                      <span
                        className={`text-sm ${
                          result.is_correct ? 'text-green-700 font-medium' : 'text-red-700'
                        }`}
                      >
                        {result.selected_answer || 'Not answered'}
                      </span>
                    </div>

                    {!result.is_correct && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-600 min-w-[100px]">
                          Correct answer:
                        </span>
                        <span className="text-sm text-green-700 font-medium">
                          {result.correct_answer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Start New Quiz
          </button>
          <button
            onClick={() => router.push(`/quiz/${quizId}`)}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

