import { useState, useMemo, useEffect, useCallback } from 'react';
import { Question } from '@/queries/quiz/types';

interface UseQuizNavigationProps {
  quizId: string;
  questions: Question[];
}

export function useQuizNavigation({ quizId, questions }: UseQuizNavigationProps) {
  const storageKey = `quiz-progress-${quizId}`;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !questions.length || isInitialized) {
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const storedAnswers = parsed.answers || {};
        const validIds = new Set(questions.map((q) => q.id));
        const filteredAnswers = Object.fromEntries(
          Object.entries(storedAnswers).filter(([id]) => validIds.has(id)),
        ) as Record<string, string>;
        const restoredIndex = Math.min(parsed.currentQuestionIndex ?? 0, Math.max(questions.length - 1, 0));

        setAnswers(filteredAnswers);
        setCurrentQuestionIndex(restoredIndex);
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsInitialized(true);
    }
  }, [isInitialized, questions, storageKey]);

  useEffect(() => {
    if (!questions.length) return;
    setCurrentQuestionIndex((prev) => Math.min(prev, Math.max(questions.length - 1, 0)));
  }, [questions.length]);

  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined' || !questions.length) {
      return;
    }

    const payload = {
      answers,
      currentQuestionIndex,
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [answers, currentQuestionIndex, isInitialized, questions.length, storageKey]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const navigation = useMemo(() => ({
    isLastQuestion: currentQuestionIndex === totalQuestions - 1,
    isFirstQuestion: currentQuestionIndex === 0,
    canGoNext: currentQuestionIndex < totalQuestions - 1,
    canGoPrevious: currentQuestionIndex > 0,
  }), [currentQuestionIndex, totalQuestions]);

  const currentAnswerState = useMemo(() => {
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
    const isAnswered = !!currentAnswer;
    const isCorrect = isAnswered && currentAnswer === currentQuestion?.correct_answer;

    return { currentAnswer, isAnswered, isCorrect };
  }, [currentQuestion, answers]);

  const handleNext = () => {
    if (navigation.canGoNext) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (navigation.canGoPrevious) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if (!currentAnswerState.isAnswered && currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));
    }
  };

  const clearProgress = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    answeredCount,
    answers,
    navigation,
    currentAnswerState,
    handleNext,
    handlePrevious,
    handleSelectAnswer,
    clearProgress,
  };
}

