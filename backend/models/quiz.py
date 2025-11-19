from pydantic import BaseModel
from typing import List


class Question(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_answer: str


class Quiz(BaseModel):
    id: str
    questions: List[Question]


class QuizResponse(BaseModel):
    quiz_id: str
    questions: List[Question]

