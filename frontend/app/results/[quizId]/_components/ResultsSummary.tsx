import { useState } from 'react';
import { QuizResult, QuizResponse } from '@/queries/quiz/types';

interface ResultsSummaryProps {
  results: QuizResult;
  questionsData?: QuizResponse;
}

export function ResultsSummary({ results, questionsData }: ResultsSummaryProps) {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (questionId: string) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const getQuestionOptions = (questionId: string) => {
    if (!questionsData) return [];
    const question = questionsData.questions.find((q) => q.id === questionId);
    return question?.options || [];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Result Summary</h2>

      {results.results.map((result, index) => {
        const isOpen = openAccordions.has(result.question_id);
        const options = getQuestionOptions(result.question_id);

        return (
          <div key={result.question_id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button onClick={() => toggleAccordion(result.question_id)} className="w-full text-left hover:bg-gray-50 transition-colors">
              <>
                <div className="flex items-center justify-between p-6 pb-4">
                  <span className="text-gray-900 font-medium">Question {index + 1}</span>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                        result.is_correct
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {result.is_correct ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Correct Answer
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Wrong Answer
                        </>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="border-t border-gray-200 mx-6" />
                <div className="px-6 pt-4 pb-6">
                  <p className="text-gray-900">{result.question}</p>
                </div>
              </>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="pt-6 space-y-3">
                  {options.map((option, optionIndex) => {
                    const isSelected = option === result.selected_answer;
                    const isCorrect = option === result.correct_answer;

                    const getOptionStyles = () => {
                      if (isSelected && isCorrect) return 'border-green-500 bg-green-50';
                      if (isSelected && !isCorrect) return 'border-red-500 bg-red-50';
                      if (isCorrect) return 'border-green-500 bg-green-50';
                      return 'border-gray-300 bg-gray-50';
                    };

                    const getRadioStyles = () => {
                      if (isSelected && isCorrect) return 'border-green-600 bg-green-600';
                      if (isSelected && !isCorrect) return 'border-red-600 bg-red-600';
                      if (isCorrect) return 'border-green-600 bg-green-600';
                      return 'border-gray-300';
                    };

                    return (
                      <div key={optionIndex} className={`flex items-center p-4 border-2 rounded-lg ${getOptionStyles()}`}>
                        <div className="flex items-center flex-1 gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${getRadioStyles()}`}>
                            {(isSelected || isCorrect) && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className={`${isCorrect ? 'font-semibold' : ''}`}>{option}</span>
                        </div>
                        {isCorrect && <span className="text-sm text-green-700 font-medium ml-2">Correct Answer</span>}
                        {isSelected && !isCorrect && <span className="text-sm text-red-700 font-medium ml-2">Wrong Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


