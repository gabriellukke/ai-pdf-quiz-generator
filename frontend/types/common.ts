export interface PageParams<T extends Record<string, string>> {
  params: Promise<T>;
}

export type QuizPageParams = PageParams<{ quizId: string }>;

