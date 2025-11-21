interface EditOptionInputProps {
  option: string;
  optionIndex: number;
  isCorrect: boolean;
  onOptionChange: (value: string) => void;
  onMarkCorrect: () => void;
}

export function EditOptionInput({
  option,
  optionIndex,
  isCorrect,
  onOptionChange,
  onMarkCorrect,
}: EditOptionInputProps) {
  return (
    <div>
      <div className="flex items-center gap-3 group">
        <label className="text-sm text-gray-600 whitespace-nowrap min-w-[70px] hidden sm:block">
          Option {optionIndex + 1}:
        </label>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1 sm:hidden">Option {optionIndex + 1}</label>
          <div className="relative overflow-hidden rounded-lg">
            <input
              type="text"
              value={option}
              onChange={(e) => onOptionChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors focus:bg-primary-50 focus:border-primary-300 ${
                isCorrect ? 'border-gray-300 sm:pr-36' : 'border-gray-300'
              }`}
              placeholder={`Enter option ${optionIndex + 1}`}
            />
            {isCorrect && (
              <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1.5 text-sm text-green-600 bg-green-50 px-2.5 py-1 rounded border border-green-200 pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium">Correct Answer</span>
              </div>
            )}
            {!isCorrect && (
              <button
                type="button"
                onClick={onMarkCorrect}
                className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 mr-3 px-3 py-2 rounded-lg border-2 bg-white border-primary-500 text-primary-500 font-medium text-sm whitespace-nowrap transition-all duration-300 ease-in-out translate-x-[calc(100%+12px)] group-hover:translate-x-0 hover:bg-primary-50 shadow-md"
              >
                Mark as Correct
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="sm:hidden mt-2 flex items-center justify-end gap-2">
        {isCorrect ? (
          <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-2.5 py-1 rounded border border-green-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-medium">Correct Answer</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onMarkCorrect}
            className="px-3 py-1.5 rounded-lg border-2 border-primary-500 text-primary-500 font-medium text-xs hover:bg-primary-50 transition-colors"
          >
            Mark as Correct
          </button>
        )}
      </div>
    </div>
  );
}

