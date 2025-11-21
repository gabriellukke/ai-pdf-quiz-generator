import Image from 'next/image';

interface QuizFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
}

export function QuizFeedback({ isCorrect, correctAnswer }: QuizFeedbackProps) {
  return (
    <div
      className={`w-full p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3 animate-fade-in ${
        isCorrect ? 'bg-[#E8F9F1]' : 'bg-red-50 border-l-4 border-red-500'
      }`}
    >
      {isCorrect ? (
        <Image src="/checkmark.svg" alt="Correct" width={32} height={34} className="shrink-0 sm:w-[42px] sm:h-[44px]" />
      ) : (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-red-100">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-xl sm:text-[26px] leading-none ${
            isCorrect ? 'text-[#009758]' : 'text-red-900'
          }`}
        >
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </p>
        {!isCorrect && (
          <p className="text-xs sm:text-sm text-red-800 mt-1 wrap-break-word">
            The correct answer is: <span className="font-semibold">{correctAnswer}</span>
          </p>
        )}
      </div>
    </div>
  );
}

