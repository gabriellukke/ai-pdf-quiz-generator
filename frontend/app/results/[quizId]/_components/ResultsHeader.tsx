interface ResultsHeaderProps {
  onBack: () => void;
  onRetake: () => void;
}

export function ResultsHeader({ onBack, onRetake }: ResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </button>
      <button
        onClick={onRetake}
        className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-black transition"
      >
        Retake Quiz
      </button>
    </div>
  );
}


