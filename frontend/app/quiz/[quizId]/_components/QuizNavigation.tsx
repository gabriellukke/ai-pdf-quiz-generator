interface QuizNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswered: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function QuizNavigation({
  isFirstQuestion,
  isLastQuestion,
  isAnswered,
  isSubmitting,
  onPrevious,
  onNext,
}: QuizNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="px-5 sm:px-6 py-2 border-2 border-primary-500 rounded-lg font-medium text-sm text-primary-500 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      <button
        onClick={onNext}
        disabled={!isAnswered || isSubmitting}
        className="px-5 sm:px-6 py-2 bg-primary-500 border-2 border-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
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
  );
}

