'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetQuizQuestions, useUpdateQuizQuestions } from '@/queries/quiz/hooks';
import { Question } from '@/queries/quiz/types';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { QuizPageParams } from '@/types/common';
import { EditHeader, EditQuestionCard } from './_components';

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
        <EditHeader />

        <div className="space-y-6 mb-6">
          {mergedQuestions.map((question, qIndex) => (
            <EditQuestionCard
              key={question.id}
              question={question}
              questionIndex={qIndex}
              onQuestionChange={(field, value) => handleQuestionChange(qIndex, field, value)}
              onOptionChange={(optionIndex, value) => handleOptionChange(qIndex, optionIndex, value)}
              onMarkCorrect={(option) => handleQuestionChange(qIndex, 'correct_answer', option)}
            />
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

