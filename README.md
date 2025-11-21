# AI-Powered PDF Quiz Generator

AI-powered quiz generation system with FastAPI, OpenAI GPT-4o-mini, and a Next.js (React + TypeScript + TanStack Query) frontend. Upload PDFs, get AI-generated multiple-choice questions, edit them, take quizzes, and view detailed results with answer review.

## Deployed URLs

Frontend: [Vercel URL - TBD]

Backend (API): [Render URL - TBD]

API Docs (Swagger): [Backend URL]/docs

## Tech Stack

**Frontend:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4, TanStack Query v5 (state management), Axios (API client)

**Backend:** FastAPI, Pydantic, PyPDF 6.3, OpenAI API 2.8 (GPT-4o-mini)

**Infra:** Docker Compose (dev), Vercel (FE), Render (BE)

## Features Implemented

✅ **Core Requirements:**
- PDF upload with drag-and-drop interface
- AI question generation (10 multiple-choice per PDF)
- Question editing before quiz start
- Interactive quiz with immediate feedback
- Progress tracking and navigation
- Results dashboard with detailed breakdown
- Share results functionality

✅ **Stretch Goals (3/4 completed):**
- 📱 **Mobile Friendly** – Fully responsive design, optimized layouts for mobile/tablet
- 🌀 **Animation** – Loading states (skeleton animations), page transitions, feedback animations
- 💾 **Persistence** – LocalStorage autosave for quiz progress (survives refresh/navigation)

## Setup & Installation

### 1) Environment

**backend/.env**
```bash
OPENAI_API_KEY=your_openai_key_here
USE_MOCK_AI=false
```

**frontend/.env.local** (optional, defaults work locally)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2) Run (Docker, recommended)

```bash
# from repo root
docker-compose up -d --build

# services: frontend (3000), backend (8000)
# access: http://localhost:3000
```

### 3) Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
echo "OPENAI_API_KEY=your-key" > .env
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev  # http://localhost:3000
```

## API Documentation

OpenAPI Docs (Swagger UI): `GET /docs` • ReDoc: `GET /redoc`

### Health Check
```bash
GET /
200 → {"message": "PDF Quiz Generator API is running"}

GET /health
200 → {"status": "healthy"}
```

### Upload PDF & Generate Quiz
```bash
POST /api/upload
Content-Type: multipart/form-data
Body: file=<pdf_file>

200 → {
  "quiz_id": "<uuid>",
  "questions": [
    {
      "id": "<uuid>",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A"
    }
  ]
}

400 → {"detail": "Only PDF files are allowed"}
413 → {"detail": "File size must be less than 10MB"}
403 → {"detail": "OpenAI API quota exceeded..."}
```

### Get Quiz Questions
```bash
GET /api/questions/{quiz_id}

200 → {
  "quiz_id": "<uuid>",
  "questions": [...]
}

404 → {"detail": "Quiz not found"}
```

### Update Quiz Questions
```bash
PUT /api/questions/{quiz_id}
Body: {
  "questions": [
    {
      "id": "<uuid>",
      "question": "updated question",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A"
    }
  ]
}

200 → {"message": "Questions updated successfully"}
404 → {"detail": "Quiz not found"}
```

### Submit Quiz Answers
```bash
POST /api/quiz/{quiz_id}/submit
Body: {
  "answers": [
    {
      "question_id": "<uuid>",
      "selected_answer": "A"
    }
  ]
}

200 → {
  "score": 8,
  "total": 10,
  "percentage": 80.0,
  "results": [
    {
      "question_id": "<uuid>",
      "question": "string",
      "selected_answer": "A",
      "correct_answer": "A",
      "is_correct": true
    }
  ]
}

404 → {"detail": "Quiz not found"}
```

### Get Quiz Results
```bash
GET /api/quiz/{quiz_id}/result

200 → {
  "score": 8,
  "total": 10,
  "percentage": 80.0,
  "results": [...]
}

404 → {"detail": "Quiz result not found"}
```

## Curl Quickstart

```bash
# Upload PDF
curl -X POST http://localhost:8000/api/upload \
  -F "file=@sample.pdf"

# Get questions
curl http://localhost:8000/api/questions/<quiz_id>

# Submit answers
curl -X POST http://localhost:8000/api/quiz/<quiz_id>/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"question_id":"...","selected_answer":"A"}]}'

# Get results
curl http://localhost:8000/api/quiz/<quiz_id>/result
```

## Design Notes

**Frontend Architecture:** Modern App Router with React Server Components provides automatic code splitting and built-in image optimization. TanStack Query handles all server state with automatic caching, background refetching, and optimistic updates—eliminating the need for additional state management libraries.

**Component Design:** Following modern React patterns, we co-locate page-specific components with their pages (`app/quiz/[quizId]/_components/`) rather than mixing them into a global `components/` folder. This architecture makes ownership clear, simplifies refactoring, and reduces import paths. Truly shared components (LoadingState, Providers) remain in the root `components/` directory. Each page component stays lean (<150 lines) by delegating to smaller, focused subcomponents.

**State Management Strategy:** Custom hooks encapsulate complex logic:
- `useQuizNavigation`: Manages quiz state (current question, answers, navigation), syncs to localStorage on every change for persistence
- `useResultsSummary`: Derives score calculations, feedback messages, and question options from cached data
- `useShareResults`: Handles clipboard operations and toast notifications

This separation keeps page components focused on composition while hooks handle business logic and side effects. LocalStorage persistence uses a `{[quizId]: {answers, currentIndex}}` structure, enabling multiple quizzes in progress simultaneously.

**Responsive Design:** Mobile-first approach with Tailwind's responsive utilities. Key decisions:
- Responsive typography (`text-sm sm:text-base`) prevents overflow on small screens
- Touch-friendly targets (min 44px) for all interactive elements
- Prevented layout shifts with `min-h` on feedback containers
- Tested on iPhone SE (375px), iPad (768px), and desktop (1920px)

**User Experience:**
- **Loading states:** Skeleton screens with animated illustrations match Figma designs, reducing perceived wait time
- **Error handling:** Axios interceptors extract API error details, custom ErrorAlert component detects error types (quota, invalid key) and displays actionable solutions with direct links
- **Animations:** Subtle transitions (`fade-in`, `bounce`, `shimmer`) provide feedback without being distracting
- **Progress indicators:** Visual progress bar and question counter keep users oriented

**TypeScript Integration:** Strict mode enabled, no `any` types. Shared types live in `types/common.ts`, API types in `queries/quiz/types.ts`. Pydantic models on backend ensure type safety across the API boundary.

**Performance Optimizations:**
- React Query caches API responses, deduplicates simultaneous requests
- Next.js Image component for optimized logo/icon loading
- Lazy loading for results page (only loads after quiz submission)
- Minimal bundle size: avoided heavy libraries, used Tailwind's JIT compiler

**Backend:** Simple FastAPI service with in-memory storage (adequate for MVP/demo). OpenAI integration includes error handling for quota/rate limits and option shuffling for quiz variety.

## Project Structure

```
.
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── models/                  # Pydantic models (Quiz, Question, Result)
│   ├── routers/
│   │   └── upload.py           # API routes (upload, questions, submit, results)
│   ├── services/
│   │   ├── ai_service.py       # OpenAI integration & mock mode
│   │   └── pdf_service.py      # PDF text extraction
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── (home)/             # Home page components (upload)
│   │   ├── edit/[quizId]/      # Question editing page
│   │   ├── quiz/[quizId]/      # Quiz taking page
│   │   │   └── _components/    # Quiz-specific components
│   │   └── results/[quizId]/   # Results page
│   │       └── _components/    # Results-specific components
│   ├── components/             # Shared components (LoadingState, Providers)
│   ├── hooks/                  # Custom hooks (useQuizNavigation, etc.)
│   ├── lib/                    # API client, utilities
│   ├── queries/                # TanStack Query setup
│   │   └── quiz/              # Quiz queries, mutations, cache updaters
│   └── types/                  # Shared TypeScript types
│
└── docker-compose.yml
```

## Future Enhancements

- **Database persistence** (PostgreSQL/MongoDB) for multi-session quiz history
- **Streaming AI explanations** using SSE for incorrect answers
- **User authentication** and quiz attempt tracking
- **Custom quiz configuration** (question count, difficulty)
- **More document formats** (DOCX, TXT, Markdown)
- **Batch question regeneration** for low-quality outputs
- **Analytics dashboard** (average scores, common mistakes)
