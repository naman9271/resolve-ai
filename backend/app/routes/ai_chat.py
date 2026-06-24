"""
AI Chat Routes with Streaming Support
Handles all AI-related endpoints for the JEE doubt solver
"""
import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.ai.agent import get_jee_agent, JEEAgent
from app.ai.pyq_database import get_pyq_database, PYQDatabase

router = APIRouter()


# ============== Request/Response Models ==============

class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Chat request with message and optional history"""
    message: str = Field(..., description="User's message", min_length=1)
    history: Optional[list[ChatMessage]] = Field(default=None, description="Previous conversation history")
    stream: bool = Field(default=True, description="Whether to stream the response")


class ChatResponse(BaseModel):
    """Non-streaming chat response"""
    response: str = Field(..., description="AI response")
    intent: Optional[str] = Field(default=None, description="Detected intent")
    subject: Optional[str] = Field(default=None, description="Detected subject")


class PYQRequest(BaseModel):
    """Request for PYQ questions"""
    subject: Optional[str] = Field(default=None, description="Subject filter")
    chapter: Optional[str] = Field(default=None, description="Chapter filter")
    topic: Optional[str] = Field(default=None, description="Topic filter")
    difficulty: Optional[str] = Field(default=None, description="Difficulty filter")
    exam_type: Optional[str] = Field(default=None, description="Exam type filter")
    year: Optional[int] = Field(default=None, description="Year filter")
    limit: int = Field(default=10, description="Maximum number of questions", ge=1, le=50)


class PYQQuestion(BaseModel):
    """PYQ Question response"""
    id: str
    year: int
    exam_type: str
    subject: str
    chapter: str
    topic: str
    question: str
    options: list[str]
    difficulty: str
    hint: Optional[str] = None


class PYQQuestionWithSolution(PYQQuestion):
    """PYQ Question with solution"""
    correct_answer: int
    solution: str


# ============== Chat Endpoints ==============

@router.post("/message")
async def chat_message(request: ChatRequest):
    """
    Send a message to the AI agent.
    
    If stream=True, returns a streaming response.
    If stream=False, returns a complete response.
    """
    try:
        agent = get_jee_agent()
        
        # Convert history format
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        if request.stream:
            # Return streaming response
            async def generate():
                try:
                    async for chunk in agent.chat_stream(request.message, history):
                        # Send as Server-Sent Events format
                        yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                    yield f"data: {json.dumps({'done': True})}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
            return StreamingResponse(
                generate(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no"
                }
            )
        else:
            # Non-streaming response
            response = await agent.chat(request.message, history)
            return ChatResponse(response=response)
            
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI Configuration Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
async def chat_simple(request: ChatRequest):
    """
    Simple chat endpoint (non-streaming).
    Use /message with stream=true for streaming.
    """
    try:
        agent = get_jee_agent()
        
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        response = await agent.chat(request.message, history)
        return ChatResponse(response=response)
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI Configuration Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")


# ============== PYQ Endpoints ==============

@router.get("/pyq/subjects")
async def get_subjects():
    """Get list of all available subjects"""
    db = get_pyq_database()
    return {"subjects": db.get_subjects()}


@router.get("/pyq/chapters")
async def get_chapters(subject: Optional[str] = Query(None)):
    """Get list of chapters, optionally filtered by subject"""
    db = get_pyq_database()
    return {"chapters": db.get_chapters(subject)}


@router.get("/pyq/topics")
async def get_topics(
    subject: Optional[str] = Query(None),
    chapter: Optional[str] = Query(None)
):
    """Get list of topics, optionally filtered by subject and chapter"""
    db = get_pyq_database()
    return {"topics": db.get_topics(subject, chapter)}


@router.post("/pyq/questions")
async def get_pyq_questions(request: PYQRequest):
    """
    Get PYQ questions based on filters.
    Returns questions without solutions for practice.
    """
    db = get_pyq_database()
    questions = db.get_questions(
        subject=request.subject,
        chapter=request.chapter,
        topic=request.topic,
        difficulty=request.difficulty,
        exam_type=request.exam_type,
        year=request.year,
        limit=request.limit
    )
    
    # Return without solutions
    return {
        "questions": [
            PYQQuestion(
                id=q["id"],
                year=q["year"],
                exam_type=q["exam_type"],
                subject=q["subject"],
                chapter=q["chapter"],
                topic=q["topic"],
                question=q["question"],
                options=q["options"],
                difficulty=q["difficulty"],
                hint=q.get("hint")
            )
            for q in questions
        ],
        "total": len(questions)
    }


@router.get("/pyq/question/{question_id}")
async def get_pyq_by_id(question_id: str, show_solution: bool = Query(False)):
    """
    Get a specific PYQ question by ID.
    Use show_solution=true to include the solution.
    """
    db = get_pyq_database()
    question = db.get_question_by_id(question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    if show_solution:
        return PYQQuestionWithSolution(
            id=question["id"],
            year=question["year"],
            exam_type=question["exam_type"],
            subject=question["subject"],
            chapter=question["chapter"],
            topic=question["topic"],
            question=question["question"],
            options=question["options"],
            difficulty=question["difficulty"],
            hint=question.get("hint"),
            correct_answer=question["correct_answer"],
            solution=question["solution"]
        )
    else:
        return PYQQuestion(
            id=question["id"],
            year=question["year"],
            exam_type=question["exam_type"],
            subject=question["subject"],
            chapter=question["chapter"],
            topic=question["topic"],
            question=question["question"],
            options=question["options"],
            difficulty=question["difficulty"],
            hint=question.get("hint")
        )


@router.post("/pyq/check-answer")
async def check_answer(question_id: str, user_answer: int):
    """
    Check if the user's answer is correct.
    Returns correctness and solution.
    """
    db = get_pyq_database()
    question = db.get_question_by_id(question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = user_answer == question["correct_answer"]
    
    return {
        "correct": is_correct,
        "correct_answer": question["correct_answer"],
        "solution": question["solution"],
        "hint": question.get("hint", "")
    }


# ============== AI-Powered PYQ Explanation ==============

@router.post("/pyq/explain/{question_id}")
async def explain_pyq(question_id: str, stream: bool = Query(True)):
    """
    Get an AI-generated detailed explanation for a PYQ.
    Includes step-by-step solution, common mistakes, and tips.
    """
    db = get_pyq_database()
    question = db.get_question_by_id(question_id)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    try:
        agent = get_jee_agent()
        
        # Create a detailed explanation prompt
        prompt = f"""Please provide a detailed explanation for this JEE question:

**Question ({question['year']} {question['exam_type']} - {question['subject']})**
Topic: {question['topic']}

{question['question']}

Options:
A. {question['options'][0]}
B. {question['options'][1]}
C. {question['options'][2]}
D. {question['options'][3]}

Please explain:
1. Step-by-step solution with all working
2. The correct answer and why
3. Common mistakes students make
4. Key concepts to remember
5. Tips for similar questions in exams"""

        if stream:
            async def generate():
                try:
                    async for chunk in agent.chat_stream(prompt, None):
                        yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                    yield f"data: {json.dumps({'done': True})}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
            return StreamingResponse(
                generate(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive"
                }
            )
        else:
            response = await agent.chat(prompt, None)
            return {"explanation": response}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
