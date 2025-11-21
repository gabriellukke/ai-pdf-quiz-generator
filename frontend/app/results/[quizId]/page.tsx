'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { QuizPageParams } from '@/types/common';
import { useShareResults } from '@/hooks/useShareResults';
import { useResultsSummary } from '@/hooks/useResultsSummary';
import { ResultsHeader } from './_components/ResultsHeader';
import { ResultsHeroCard } from './_components/ResultsHeroCard';
import { ResultsSummary } from './_components/ResultsSummary';
import { ResultsToast } from './_components/ResultsToast';

export default function ResultsPage({ params }: QuizPageParams) {
  const { quizId } = use(params);
  const router = useRouter();

  const {
    results,
    questionsData,
    score,
    total,
    percentage,
    incorrectAnswers,
    feedbackMessage,
    isLoading,
  } = useResultsSummary(quizId);
  const { copyToClipboard, toastMessage, dismissToast } = useShareResults({ score, total, percentage });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-8 pb-20">
        <ResultsHeader onBack={() => router.push('/')} onRetake={() => router.push(`/quiz/${quizId}`)} />

        <ResultsHeroCard
          score={score}
          total={total}
          percentage={percentage}
          incorrectAnswers={incorrectAnswers}
          feedbackMessage={feedbackMessage}
          onShare={copyToClipboard}
        />

        <ResultsSummary results={results} questionsData={questionsData} />

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

        {toastMessage && <ResultsToast message={toastMessage} onDismiss={dismissToast} />}
      </div>
    </div>
  );
}

