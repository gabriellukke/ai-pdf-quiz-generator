import { Question } from '@/queries/quiz/types';
import { EditOptionInput } from './EditOptionInput';

interface EditQuestionCardProps {
  question: Question;
  questionIndex: number;
  onQuestionChange: (field: keyof Question, value: string | string[]) => void;
  onOptionChange: (optionIndex: number, value: string) => void;
  onMarkCorrect: (option: string) => void;
}

export function EditQuestionCard({
  question,
  questionIndex,
  onQuestionChange,
  onOptionChange,
  onMarkCorrect,
}: EditQuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question {questionIndex + 1}</label>
        <textarea
          value={question.question}
          onChange={(e) => onQuestionChange('question', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:bg-[#6D56FA14] focus:border-[#6D56FA33] transition-colors"
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Multichoice Answers</label>
        {question.options.map((option, oIndex) => (
          <EditOptionInput
            key={oIndex}
            option={option}
            optionIndex={oIndex}
            isCorrect={question.correct_answer === option}
            onOptionChange={(value) => {
              onOptionChange(oIndex, value);
              if (question.correct_answer === option) {
                onQuestionChange('correct_answer', value);
              }
            }}
            onMarkCorrect={() => onMarkCorrect(option)}
          />
        ))}
      </div>
    </div>
  );
}

