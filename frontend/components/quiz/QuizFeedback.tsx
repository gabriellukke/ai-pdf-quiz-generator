interface QuizFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
}

export function QuizFeedback({ isCorrect, correctAnswer }: QuizFeedbackProps) {
  return (
    <div
      className={`w-full p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
        isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCorrect ? 'bg-green-100' : 'bg-red-100'
        }`}
      >
        {isCorrect ? (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </p>
        {!isCorrect && (
          <p className="text-sm text-red-800 mt-1">
            The correct answer is: <span className="font-semibold">{correctAnswer}</span>
          </p>
        )}
      </div>
    </div>
  );
}

