import api, { apiForFiles } from '@/lib/api';
import { QuizResponse, Question, QuizSubmission, QuizResult } from './types';

export default class QuizApi {
  static uploadPdf(file: File): Promise<QuizResponse> {
    return apiForFiles.post('/api/upload', { file });
  }

  static getQuestions(quizId: string): Promise<QuizResponse> {
    return api.get(`/api/questions/${quizId}`);
  }

  static updateQuestions(quizId: string, questions: Question[]): Promise<QuizResponse> {
    return api.put(`/api/questions/${quizId}`, questions);
  }

  static submitQuiz(quizId: string, submission: QuizSubmission): Promise<QuizResult> {
    return api.post(`/api/quiz/${quizId}/submit`, submission);
  }

  static getQuizResult(quizId: string): Promise<QuizResult> {
    return api.get(`/api/quiz/${quizId}/result`);
  }
}

