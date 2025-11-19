from pydantic import BaseModel
from typing import List, Dict


class Answer(BaseModel):
    question_id: str
    selected_answer: str


class QuizSubmission(BaseModel):
    answers: List[Answer]


class QuestionResult(BaseModel):
    question_id: str
    question: str
    selected_answer: str
    correct_answer: str
    is_correct: bool


class QuizResult(BaseModel):
    quiz_id: str
    score: int
    total: int
    percentage: float
    results: List[QuestionResult]

