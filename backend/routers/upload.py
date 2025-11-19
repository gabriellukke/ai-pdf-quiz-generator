from fastapi import APIRouter, UploadFile, File, HTTPException
from models import QuizResponse, Question, QuizSubmission, QuizResult, QuestionResult
from services import extract_text_from_pdf, generate_questions
from typing import List
import uuid


router = APIRouter(prefix="/api", tags=["quiz"])

quizzes_db = {}


@router.post("/upload", response_model=QuizResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF and generate quiz questions."""
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        content = await file.read()
        
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be less than 10MB")
        
        text = await extract_text_from_pdf(content)
        
        questions_data = await generate_questions(text)
        
        quiz_id = str(uuid.uuid4())
        questions = [Question(**q) for q in questions_data]
        
        quizzes_db[quiz_id] = {
            "id": quiz_id,
            "questions": questions
        }
        
        return QuizResponse(quiz_id=quiz_id, questions=questions)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/questions/{quiz_id}", response_model=QuizResponse)
async def get_questions(quiz_id: str):
    """Get questions for a specific quiz."""
    
    if quiz_id not in quizzes_db:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    quiz = quizzes_db[quiz_id]
    return QuizResponse(quiz_id=quiz_id, questions=quiz["questions"])


@router.put("/questions/{quiz_id}", response_model=QuizResponse)
async def update_questions(quiz_id: str, questions: List[Question]):
    """Update questions for a specific quiz."""
    
    if quiz_id not in quizzes_db:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if len(questions) != 10:
        raise HTTPException(status_code=400, detail="Must provide exactly 10 questions")
    
    for question in questions:
        if len(question.options) != 4:
            raise HTTPException(status_code=400, detail="Each question must have exactly 4 options")
        if question.correct_answer not in question.options:
            raise HTTPException(status_code=400, detail=f"Correct answer must be one of the options for question: {question.id}")
    
    quizzes_db[quiz_id]["questions"] = questions
    
    return QuizResponse(quiz_id=quiz_id, questions=questions)


@router.post("/quiz/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(quiz_id: str, submission: QuizSubmission):
    """Submit quiz answers and get results."""
    
    if quiz_id not in quizzes_db:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    quiz = quizzes_db[quiz_id]
    questions = quiz["questions"]
    
    answers_dict = {answer.question_id: answer.selected_answer for answer in submission.answers}
    
    results = []
    correct_count = 0
    
    for question in questions:
        selected_answer = answers_dict.get(question.id, "")
        is_correct = selected_answer == question.correct_answer
        
        if is_correct:
            correct_count += 1
        
        results.append(QuestionResult(
            question_id=question.id,
            question=question.question,
            selected_answer=selected_answer,
            correct_answer=question.correct_answer,
            is_correct=is_correct
        ))
    
    total = len(questions)
    percentage = (correct_count / total * 100) if total > 0 else 0
    
    return QuizResult(
        quiz_id=quiz_id,
        score=correct_count,
        total=total,
        percentage=round(percentage, 2),
        results=results
    )

