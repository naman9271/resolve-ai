# Resolve AI - AI Agent for JEE Students

This module contains the AI-powered doubt solving and PYQ system for JEE students.

## Features

- 🤖 **AI Doubt Solver** - Powered by Google Gemini with LangChain & LangGraph
- 📝 **PYQ Database** - Previous Year Questions for Physics, Chemistry, and Mathematics
- 🔄 **Streaming Responses** - Real-time AI response streaming
- 🎯 **Intent Detection** - Automatically detects if user wants PYQs or concept explanations

## Architecture

```
app/ai/
├── __init__.py          # Module exports
├── agent.py             # JEE AI Agent with LangGraph
├── pyq_database.py      # PYQ database and retrieval
└── README.md            # This file

app/routes/
└── ai_chat.py           # API endpoints for AI chat and PYQs
```

## Setup

1. **Get Google API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to `backend/.env`:
     ```
     GOOGLE_API_KEY=your-api-key-here
     ```

2. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the Server**
   ```bash
   uvicorn app.main:app --reload
   ```

## API Endpoints

### Chat Endpoints

#### POST `/api/v1/ai/message`
Send a message to the AI agent with streaming support.

**Request Body:**
```json
{
  "message": "Explain Newton's laws of motion",
  "history": [
    {"role": "user", "content": "previous message"},
    {"role": "assistant", "content": "previous response"}
  ],
  "stream": true
}
```

**Response (Streaming):**
Server-Sent Events with chunks:
```
data: {"chunk": "Newton's"}
data: {"chunk": " first law"}
data: {"chunk": "..."}
data: {"done": true}
```

#### POST `/api/v1/ai/chat`
Non-streaming chat endpoint.

### PYQ Endpoints

#### GET `/api/v1/ai/pyq/subjects`
Get list of all available subjects.

#### GET `/api/v1/ai/pyq/chapters?subject=Physics`
Get chapters for a subject.

#### GET `/api/v1/ai/pyq/topics?subject=Physics&chapter=Mechanics`
Get topics for a chapter.

#### POST `/api/v1/ai/pyq/questions`
Get PYQ questions with filters.

**Request Body:**
```json
{
  "subject": "Physics",
  "chapter": "Mechanics",
  "difficulty": "medium",
  "limit": 10
}
```

#### GET `/api/v1/ai/pyq/question/{question_id}?show_solution=true`
Get a specific question with optional solution.

#### POST `/api/v1/ai/pyq/check-answer?question_id=xxx&user_answer=2`
Check if the user's answer is correct.

#### POST `/api/v1/ai/pyq/explain/{question_id}?stream=true`
Get AI-generated explanation for a question (streaming).

## Agent Architecture (LangGraph)

```
┌─────────────────┐
│  User Message   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Intent Classifier│──── Detects: doubt_solving, pyq_request,
└────────┬────────┘      concept_explanation, problem_solving
         │
         ▼
    ┌────┴────┐
    │  Route  │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌──────────────┐
│Fetch  │ │   Generate   │
│ PYQs  │ │   Response   │
└───┬───┘ └──────────────┘
    │              ▲
    └──────────────┘
              │
              ▼
    ┌─────────────────┐
    │  Final Response │
    │  (Streaming)    │
    └─────────────────┘
```

## Extending the PYQ Database

To add more questions, edit `app/ai/pyq_database.py`:

```python
{
    "id": "unique_id",
    "year": 2024,
    "exam_type": "JEE Main",
    "subject": "Physics",
    "chapter": "Mechanics",
    "topic": "Rotational Motion",
    "question": "Your question here...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": 0,  # Index of correct option
    "difficulty": "medium",
    "solution": "Step-by-step solution...",
    "hint": "Helpful hint..."
}
```

## Frontend Integration

The chat page (`frontend/app/chat/page.tsx`) uses the streaming API:

```typescript
import { chatApi, ChatMessage } from "@/lib/api";

// Streaming chat
for await (const chunk of chatApi.sendMessageStream(message, history)) {
  // Update UI with each chunk
  fullResponse += chunk;
}
```

## Model Configuration

The agent uses:
- **Model**: `gemini-1.5-flash`
- **Temperature**: 0.7
- **Streaming**: Enabled

To change the model or parameters, edit `app/ai/agent.py`:

```python
self.llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",  # Change model
    temperature=0.5,         # Adjust creativity
    streaming=True,
)
```
