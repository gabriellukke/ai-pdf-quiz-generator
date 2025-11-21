# AI-Powered PDF Quiz Generator

Generate interactive quizzes from PDF documents using AI.

## Features

- Upload PDF and generate quiz questions automatically
- Edit questions before starting
- Take quiz with immediate feedback
- View detailed results
- Mobile responsive design
- Auto-save progress to localStorage

## Stretch Goals Completed

- ✅ Mobile Friendly
- ✅ Animations and transitions  
- ✅ LocalStorage persistence

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query
- **Backend**: FastAPI, OpenAI API, PyPDF

## Setup

### Docker (Recommended)

```bash
# 1. Clone repo
git clone <repo-url>
cd ai-powered-pdf-quiz-generator

# 2. Add OpenAI key to backend/.env
echo "OPENAI_API_KEY=your-key" > backend/.env
echo "USE_MOCK_AI=false" >> backend/.env

# 3. Start
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "OPENAI_API_KEY=your-key" > .env
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

## Deployment

**Frontend (Vercel):**
1. Import GitHub repo
2. Set env: `NEXT_PUBLIC_API_URL=<backend-url>`
3. Deploy

**Backend (Render):**
1. Create Web Service
2. Build: `pip install -r requirements.txt`
3. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set env: `OPENAI_API_KEY`, `USE_MOCK_AI=false`
