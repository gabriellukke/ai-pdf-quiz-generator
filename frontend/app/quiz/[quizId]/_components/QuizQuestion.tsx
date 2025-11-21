import { Question } from '@/queries/quiz/types';
import { QuizOption } from './QuizOption';

interface QuizQuestionProps {
  question: Question;
  currentQuestionIndex: number;
  currentAnswer: string | null;
  isAnswered: boolean;
  onSelectAnswer: (answer: string) => void;
}

export function QuizQuestion({
  question,
  currentQuestionIndex,
  currentAnswer,
  isAnswered,
  onSelectAnswer,
}: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Question {currentQuestionIndex + 1}</h3>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <p className="text-sm sm:text-base text-gray-900">{question.question}</p>
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <QuizOption
            key={index}
            option={option}
            isSelected={currentAnswer === option}
            isCorrect={option === question.correct_answer}
            isAnswered={isAnswered}
            onSelect={() => onSelectAnswer(option)}
          />
        ))}
      </div>
    </div>
  );
}

