interface ResultsToastProps {
  message: string;
  onDismiss: () => void;
}

export function ResultsToast({ message, onDismiss }: ResultsToastProps) {
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm">
      <span>{message}</span>
      <button
        aria-label="Dismiss notification"
        className="text-white/70 hover:text-white transition"
        onClick={onDismiss}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}


