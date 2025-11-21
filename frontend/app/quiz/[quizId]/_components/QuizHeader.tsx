interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
}

export function QuizHeader({ currentQuestionIndex, totalQuestions, answeredCount }: QuizHeaderProps) {
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quiz</h1>
        <span className="text-xs sm:text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

