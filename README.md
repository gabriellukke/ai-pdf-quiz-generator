# AI-Powered PDF Quiz Generator

AI-powered quiz generation system with FastAPI, OpenAI, and a Next.js (React + TypeScript + TanStack Query) frontend. Upload PDFs, get AI-generated multiple-choice questions, edit them, take quizzes, and view detailed results with answer review.

## Tech Stack

**Frontend**: Next.js 16 + React + TypeScript, TanStack Query v5, Axios, Tailwind CSS 4, pnpm

**Backend**: FastAPI, PyPDF, OpenAI API, Pydantic, Uvicorn

**Infra**: Docker Compose (dev)

## Setup & Installation

### 1) Environment

`backend/.env`

```bash
# Required for AI generation (optional with mock mode)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Use mock questions for development (no API costs)
USE_MOCK_AI=true
```

### 2) Run (Docker, recommended)

```bash
# from repo root
docker-compose up -d --build

# Services:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### 3) Development (optional)

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev  # http://localhost:3000
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # http://localhost:8000
```

## API Documentation

OpenAPI/Swagger: `GET /docs` • ReDoc: `GET /redoc`

### Upload PDF & Generate Questions
**POST** `/api/upload`
- Body: `multipart/form-data` with PDF file
- Response: `{ "quiz_id": "...", "questions": [...] }`

### Get Questions
**GET** `/api/questions/{quiz_id}`
- Response: `{ "quiz_id": "...", "questions": [...] }`

### Update Questions
**PUT** `/api/questions/{quiz_id}`
- Body: `[{ "id", "question", "options", "correct_answer" }]`
- Response: Updated questions

### Submit Quiz
**POST** `/api/quiz/{quiz_id}/submit`
- Body: `{ "answers": [{ "question_id", "selected_answer" }] }`
- Response: `{ "quiz_id", "score", "total", "percentage", "results": [...] }`

## Architecture Overview

**Flow**: Upload PDF → PyPDF extracts text → OpenAI generates 10 multiple-choice questions → User edits questions → Take quiz (one question/page) → Submit answers → View detailed results with score and answer review.

**State Management**: TanStack Query handles all server state with modular architecture (types, keys, requests, hooks, updaters). No props-in-state anti-patterns—React Query cache is single source of truth, local state only for user interactions (form edits, navigation).

**Axios Interceptors**: Dual instances (`api` for JSON, `apiForFiles` for uploads). Response interceptors auto-extract `response.data`, request interceptor on `apiForFiles` auto-converts objects to FormData with proper headers. Enables clean API methods without repeated boilerplate.

**Backend**: Clean separation with models (Pydantic), services (PDF extraction, AI generation), and routers (endpoints). In-memory storage for MVP—simple, fast, no database setup. Mock mode (`USE_MOCK_AI=true`) provides hardcoded questions for development without API costs.

**Frontend Structure**: Modular query layer (`queries/quiz/`) with TypeScript types, query keys factory, API class with static methods, React Query hooks, and cache updaters. Pages follow natural flow: upload → edit → quiz → results. Progress tracking, confirmation dialogs, error states throughout.

## Design Notes

We chose Next.js App Router with React Server Components capability (though using client components here) and TanStack Query v5 for its powerful caching, automatic refetching, and optimistic updates. The modular query architecture separates concerns: types define contracts, keys enable precise cache invalidation, requests centralize API logic, hooks provide React integration, updaters manage cache mutations. This pattern scales well and makes the codebase highly maintainable.

FastAPI + PyPDF + OpenAI provides a simple but effective stack. PDF text extraction is synchronous but fast for typical documents. OpenAI generates questions via structured prompts requesting specific format (10 multiple-choice with 4 options each). We normalize and validate responses before returning. In-memory storage works for MVP—quizzes and results keyed by UUID, accessible across endpoints. Production would add PostgreSQL/MongoDB with proper relationships and indexing.

The dual axios instance pattern eliminates repetitive file upload code. `apiForFiles` automatically converts `{ file }` objects to FormData and sets multipart headers, while `api` handles standard JSON. Both use response interceptors to unwrap data, matching the reference pattern from production codebases. This keeps API methods clean: just `return api.get(url)` instead of `const res = ...; return res.data`.

Quiz flow emphasizes UX: drag-and-drop upload, editable AI questions (catching any AI mistakes), one-question-per-page for focus, progress bar starting empty and filling as you advance, submit confirmation with unanswered question warning, detailed results showing correct/incorrect with full review. All data flows through React Query cache—no useState + useEffect anti-patterns. For example, edit page uses a `Record<id, Question>` for local edits, merges with server data on render, only tracks changed questions in state.

Challenges included Next.js 15+ async params (solved with `React.use()`), React Query v5 mutation callback signatures (used spread args for flexibility), and proper cache updates for results page (mutation hook sets cache on submit success). Docker setup needed careful volume mounting for hot reload and pnpm compatibility. Trade-offs prioritized clean architecture and professional patterns over extensive features—the codebase demonstrates solid engineering practices suitable for scaling.

