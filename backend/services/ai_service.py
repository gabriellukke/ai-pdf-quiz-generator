import os
from openai import AsyncOpenAI
from typing import List
import json
import uuid
import random


USE_MOCK = os.getenv("USE_MOCK_AI", "false").lower() == "true"
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY")) if not USE_MOCK else None


async def generate_mock_questions(text: str) -> List[dict]:
    """Generate mock questions for testing."""
    questions = []
    for i in range(10):
        options = [
            f"Option A for question {i+1}",
            f"Option B for question {i+1}",
            f"Option C for question {i+1}",
            f"Option D for question {i+1}"
        ]
        correct_answer = options[0]
        random.shuffle(options)
        
        questions.append({
            "id": str(uuid.uuid4()),
            "question": f"Question {i+1} based on the text: What is the main topic?",
            "options": options,
            "correct_answer": correct_answer
        })
    return questions


async def generate_questions(text: str) -> List[dict]:
    """Generate 10 multiple choice questions from the given text using OpenAI."""
    
    if USE_MOCK:
        return await generate_mock_questions(text)
    
    prompt = f"""Based on the following text, generate exactly 10 multiple choice questions. 
The questions should test comprehension and key concepts from the text.

Text:
{text[:4000]}

Return your response as a JSON array with exactly 10 objects, each containing:
- "question": the question text
- "options": an array of exactly 4 answer options (mix of correct and incorrect)
- "correct_answer": the correct answer (must match one of the options exactly)

Make sure the incorrect options are plausible but clearly wrong.

Format:
[
  {{
    "question": "...",
    "options": ["option1", "option2", "option3", "option4"],
    "correct_answer": "option1"
  }},
  ...
]"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates multiple choice quiz questions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        
        if not response.choices or not response.choices[0].message:
            raise ValueError("OpenAI returned invalid response structure.")
        
        content = response.choices[0].message.content
        
        if not content:
            raise ValueError("OpenAI returned empty response. Please try again.")
        
        # Strip markdown code blocks if present
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]  # Remove ```json
        if content.startswith("```"):
            content = content[3:]  # Remove ```
        if content.endswith("```"):
            content = content[:-3]  # Remove closing ```
        content = content.strip()
        
        try:
            questions_data = json.loads(content)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse OpenAI response as JSON: {str(e)}. Response: {content[:200]}")
        
        questions = []
        for q in questions_data[:10]:
            options = q["options"][:4]
            correct_answer = q["correct_answer"]
            
            random.shuffle(options)
            
            questions.append({
                "id": str(uuid.uuid4()),
                "question": q["question"],
                "options": options,
                "correct_answer": correct_answer
            })
        
        return questions
    except Exception as e:
        error_message = str(e)
        
        if "insufficient_quota" in error_message or "exceeded your current quota" in error_message:
            raise ValueError("OpenAI API quota exceeded. Please add billing credits to your OpenAI account at https://platform.openai.com/account/billing or contact support.")
        elif "invalid_api_key" in error_message or "Incorrect API key" in error_message:
            raise ValueError("Invalid OpenAI API key. Please check your API key configuration.")
        elif "rate_limit" in error_message:
            raise ValueError("OpenAI API rate limit exceeded. Please try again in a moment.")
        else:
            raise ValueError(f"Error generating questions: {error_message}")

