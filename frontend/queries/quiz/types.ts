export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface QuizResponse {
  quiz_id: string;
  questions: Question[];
}

export interface QuizAnswer {
  question_id: string;
  selected_answer: string;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

export interface QuestionResult {
  question_id: string;
  question: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface QuizResult {
  quiz_id: string;
  score: number;
  total: number;
  percentage: number;
  results: QuestionResult[];
}

