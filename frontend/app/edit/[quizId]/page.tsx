'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGetQuizQuestions, useUpdateQuizQuestions } from '@/queries/quiz/hooks';
import { Question } from '@/queries/quiz/types';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { QuizPageParams } from '@/types/common';

export default function EditQuiz({ params }: QuizPageParams) {
  const { quizId } = use(params);
  const router = useRouter();
  const [editedQuestions, setEditedQuestions] = useState<Record<string, Question>>({});
  
  const showButton = useScrollDirection();
  const { data, isLoading, isError } = useGetQuizQuestions(quizId);
  const updateMutation = useUpdateQuizQuestions(quizId);

  const questions = data?.questions || [];
  const mergedQuestions = questions.map((q) => editedQuestions[q.id] || q);

  const handleSaveAndStart = () => {
    updateMutation.mutate(mergedQuestions, {
      onSuccess: () => {
        router.push(`/quiz/${quizId}`);
      },
    });
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: string | string[]) => {
    const question = mergedQuestions[index];
    setEditedQuestions((prev) => ({
      ...prev,
      [question.id]: { ...question, [field]: value },
    }));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const question = mergedQuestions[questionIndex];
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    setEditedQuestions((prev) => ({
      ...prev,
      [question.id]: { ...question, options: newOptions },
    }));
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Error loading quiz. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo.svg" alt="Unstuck Logo" width={40} height={40} />
            <h1 className="text-3xl font-bold text-gray-900">Review & Edit Questions</h1>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          {mergedQuestions.map((question, qIndex) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question {qIndex + 1}
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:bg-[#6D56FA14] focus:border-[#6D56FA33] transition-colors"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Multichoice Answers</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3 group">
                    <label className="text-sm text-gray-600 whitespace-nowrap min-w-[70px]">Option {oIndex + 1}:</label>
                    <div className="flex-1 relative overflow-hidden rounded-lg">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          handleOptionChange(qIndex, oIndex, newValue);
                          if (question.correct_answer === option) {
                            handleQuestionChange(qIndex, 'correct_answer', newValue);
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors focus:bg-primary-50 focus:border-primary-300 ${
                          question.correct_answer === option
                            ? 'border-gray-300 pr-36'
                            : 'border-gray-300'
                        }`}
                        placeholder={`Enter option ${oIndex + 1}`}
                      />
                      {question.correct_answer === option && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-2.5 py-1 rounded border border-green-200 pointer-events-none">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs font-medium">Correct Answer</span>
                        </div>
                      )}
                      {question.correct_answer !== option && (
                        <button
                          type="button"
                          onClick={() => handleQuestionChange(qIndex, 'correct_answer', option)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 mr-3 px-3 py-2 rounded-lg border-2 bg-white border-primary-500 text-primary-500 font-medium text-sm whitespace-nowrap transition-all duration-300 ease-in-out translate-x-[calc(100%+12px)] group-hover:translate-x-0 hover:bg-primary-50 shadow-md"
                        >
                          Mark as Correct
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {updateMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
            Error saving questions. Please try again.
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-8 left-0 right-0 flex justify-center transition-all duration-300 ${
          showButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={handleSaveAndStart}
          disabled={updateMutation.isPending}
          className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {updateMutation.isPending ? 'Saving...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
}

