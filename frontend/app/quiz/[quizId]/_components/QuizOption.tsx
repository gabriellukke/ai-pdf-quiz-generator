interface QuizOptionProps {
  option: string;
  isSelected: boolean;
  isCorrect: boolean;
  isAnswered: boolean;
  onSelect: () => void;
}

export function QuizOption({ option, isSelected, isCorrect, isAnswered, onSelect }: QuizOptionProps) {
  const getOptionStyles = () => {
    if (!isAnswered) {
      return isSelected
        ? 'border-primary-500 bg-primary-50'
        : 'border-gray-300 bg-gray-50 hover:border-primary-300 hover:bg-primary-50 cursor-pointer';
    }

    if (isSelected && isCorrect) return 'border-green-500 bg-green-50';
    if (isSelected && !isCorrect) return 'border-red-500 bg-red-50';
    if (isCorrect) return 'border-green-500 bg-green-50';
    return 'border-gray-300 bg-gray-50';
  };

  const getRadioStyles = () => {
    if (!isAnswered) {
      return isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300';
    }

    if (isSelected && isCorrect) return 'border-green-600 bg-green-600';
    if (isSelected && !isCorrect) return 'border-red-600 bg-red-600';
    if (isCorrect) return 'border-green-600 bg-green-600';
    return 'border-gray-300';
  };

  const showCheckIcon = isAnswered && isCorrect && !isSelected;
  const showCorrectIcon = isAnswered && isSelected && isCorrect;
  const showIncorrectIcon = isAnswered && isSelected && !isCorrect;

  return (
    <button
      onClick={onSelect}
      disabled={isAnswered}
      className={`w-full flex items-center p-3 sm:p-4 border-2 rounded-lg text-left transition-all ${getOptionStyles()} ${
        isAnswered ? 'cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center flex-1 gap-2 sm:gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${getRadioStyles()}`}>
          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
          {showCheckIcon && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span className={`text-sm sm:text-base ${isAnswered && isCorrect ? 'font-semibold' : ''}`}>{option}</span>
      </div>
      {showCorrectIcon && (
        <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {showIncorrectIcon && (
        <svg className="w-6 h-6 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}

