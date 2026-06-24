"""
JEE AI Agent using LangChain, LangGraph and Google Gemini
Specialized for JEE students to help with doubts, questions, and PYQs
"""
import os
import json
from typing import TypedDict, Annotated, Sequence, Literal, AsyncIterator
from dataclasses import dataclass
from enum import Enum

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

from app.ai.pyq_database import PYQDatabase, get_pyq_database
from app.utils.config import settings


class AgentState(TypedDict):
    """State for the JEE AI Agent"""
    messages: Annotated[Sequence[BaseMessage], add_messages]
    intent: str
    subject: str
    chapter: str
    context: str
    pyq_results: list
    should_fetch_pyq: bool


class IntentType(str, Enum):
    DOUBT_SOLVING = "doubt_solving"
    PYQ_REQUEST = "pyq_request"
    CONCEPT_EXPLANATION = "concept_explanation"
    PROBLEM_SOLVING = "problem_solving"
    GENERAL_QUERY = "general_query"


# System prompt for JEE AI assistant
JEE_SYSTEM_PROMPT = """You are an expert JEE (Joint Entrance Examination) tutor AI assistant called "Resolve AI". You specialize in helping students prepare for JEE Main and JEE Advanced examinations.

Your expertise covers:
- **Physics**: Mechanics, Thermodynamics, Electromagnetism, Optics, Modern Physics, Waves
- **Chemistry**: Physical Chemistry, Organic Chemistry, Inorganic Chemistry
- **Mathematics**: Calculus, Algebra, Coordinate Geometry, Trigonometry, Probability, Vectors

Guidelines for your responses:
1. **Be Clear and Structured**: Use proper formatting with headers, bullet points, and numbered steps
2. **Show Step-by-Step Solutions**: For problems, always show complete working with each step explained
3. **Use Mathematical Notation**: Use proper symbols and formulas (LaTeX format when needed)
4. **Provide Conceptual Understanding**: Don't just give answers - explain the underlying concepts
5. **Reference JEE Syllabus**: Keep responses aligned with JEE Main/Advanced syllabus
6. **Mention Common Mistakes**: Highlight typical errors students make
7. **Give Practice Tips**: Suggest how to approach similar problems in exams
8. **Be Encouraging**: Motivate students and build their confidence

When a student asks for PYQs (Previous Year Questions):
- Provide relevant questions from past JEE exams
- Include year, exam type (Main/Advanced), and difficulty level
- Give hints before revealing solutions if asked

Current context: {context}

Remember: Your goal is to help students not just solve problems, but truly understand concepts so they can tackle any question in the actual exam."""


class JEEAgent:
    """JEE AI Agent with LangGraph for structured conversation flow"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
        if not self.api_key:
            raise ValueError("Google API Key is required. Set GOOGLE_API_KEY environment variable.")
        
        # Initialize Gemini model
        # Using gemini-2.0-flash for best performance
        # Alternatives: gemini-1.5-pro (better quality), gemini-1.5-flash
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=self.api_key,
            temperature=0.7,
            streaming=True,
            convert_system_message_to_human=True,
        )
        
        # Initialize PYQ database
        self.pyq_db = get_pyq_database()
        
        # Build the agent graph
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph workflow for the JEE agent"""
        
        # Create the graph
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("intent_classifier", self._classify_intent)
        workflow.add_node("pyq_fetcher", self._fetch_pyqs)
        workflow.add_node("response_generator", self._generate_response)
        
        # Set entry point
        workflow.set_entry_point("intent_classifier")
        
        # Add conditional edges
        workflow.add_conditional_edges(
            "intent_classifier",
            self._route_after_intent,
            {
                "fetch_pyq": "pyq_fetcher",
                "generate": "response_generator"
            }
        )
        
        # Add edges
        workflow.add_edge("pyq_fetcher", "response_generator")
        workflow.add_edge("response_generator", END)
        
        return workflow.compile()
    
    async def _classify_intent(self, state: AgentState) -> AgentState:
        """Classify the user's intent from their message"""
        
        last_message = state["messages"][-1].content if state["messages"] else ""
        
        # Intent classification prompt
        classification_prompt = f"""Analyze this JEE student's query and extract:
1. Intent: One of [doubt_solving, pyq_request, concept_explanation, problem_solving, general_query]
2. Subject: One of [Physics, Chemistry, Mathematics, General]
3. Chapter/Topic: Specific chapter or topic mentioned (or "general" if not specific)
4. Should fetch PYQ: true/false

Query: "{last_message}"

Respond in JSON format:
{{"intent": "...", "subject": "...", "chapter": "...", "should_fetch_pyq": true/false}}"""

        try:
            response = await self.llm.ainvoke([HumanMessage(content=classification_prompt)])
            
            # Parse the JSON response
            response_text = response.content.strip()
            # Extract JSON from response
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            result = json.loads(response_text.strip())
            
            state["intent"] = result.get("intent", "general_query")
            state["subject"] = result.get("subject", "General")
            state["chapter"] = result.get("chapter", "general")
            state["should_fetch_pyq"] = result.get("should_fetch_pyq", False)
            
        except (json.JSONDecodeError, Exception) as e:
            # Default values if parsing fails
            state["intent"] = "general_query"
            state["subject"] = "General"
            state["chapter"] = "general"
            state["should_fetch_pyq"] = False
        
        return state
    
    def _route_after_intent(self, state: AgentState) -> str:
        """Route based on whether we need to fetch PYQs"""
        if state.get("should_fetch_pyq", False) or state.get("intent") == "pyq_request":
            return "fetch_pyq"
        return "generate"
    
    async def _fetch_pyqs(self, state: AgentState) -> AgentState:
        """Fetch relevant PYQs from the database"""
        
        subject = state.get("subject", "General")
        chapter = state.get("chapter", "general")
        
        # Fetch PYQs
        pyqs = self.pyq_db.get_questions(
            subject=subject if subject != "General" else None,
            chapter=chapter if chapter != "general" else None,
            limit=5
        )
        
        state["pyq_results"] = pyqs
        state["context"] = f"Retrieved {len(pyqs)} PYQs for {subject} - {chapter}"
        
        return state
    
    async def _generate_response(self, state: AgentState) -> AgentState:
        """Generate the final response"""
        
        # Build context from PYQ results if available
        pyq_context = ""
        if state.get("pyq_results"):
            pyq_context = "\n\n**Relevant Previous Year Questions:**\n"
            for i, pyq in enumerate(state["pyq_results"], 1):
                pyq_context += f"""
**Question {i}** ({pyq['year']} - {pyq['exam_type']} - {pyq['difficulty'].title()})
Topic: {pyq['topic']}

{pyq['question']}

Options:
{chr(65 + 0)}. {pyq['options'][0]}
{chr(65 + 1)}. {pyq['options'][1]}
{chr(65 + 2)}. {pyq['options'][2]}
{chr(65 + 3)}. {pyq['options'][3]}

---
"""
        
        # Create the prompt with context
        context = state.get("context", "") + pyq_context
        system_message = JEE_SYSTEM_PROMPT.format(context=context if context else "No specific context")
        
        # Build messages for the LLM
        messages = [SystemMessage(content=system_message)]
        messages.extend(state["messages"])
        
        # Generate response
        response = await self.llm.ainvoke(messages)
        
        # Add response to messages
        state["messages"] = list(state["messages"]) + [response]
        
        return state
    
    async def chat(self, message: str, history: list[dict] = None) -> str:
        """
        Send a message to the agent and get a response.
        
        Args:
            message: The user's message
            history: Previous conversation history
        
        Returns:
            The agent's response
        """
        # Build message history
        messages = []
        if history:
            for msg in history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))
        
        # Add current message
        messages.append(HumanMessage(content=message))
        
        # Initial state
        initial_state: AgentState = {
            "messages": messages,
            "intent": "",
            "subject": "",
            "chapter": "",
            "context": "",
            "pyq_results": [],
            "should_fetch_pyq": False
        }
        
        # Run the graph
        result = await self.graph.ainvoke(initial_state)
        
        # Get the last AI message
        if result["messages"]:
            last_message = result["messages"][-1]
            if isinstance(last_message, AIMessage):
                return last_message.content
        
        return "I apologize, but I couldn't generate a response. Please try again."
    
    async def chat_stream(self, message: str, history: list[dict] = None) -> AsyncIterator[str]:
        """
        Send a message to the agent and stream the response.
        
        Args:
            message: The user's message
            history: Previous conversation history
        
        Yields:
            Chunks of the agent's response
        """
        # Build message history
        messages = []
        if history:
            for msg in history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))
        
        # Add current message
        messages.append(HumanMessage(content=message))
        
        # Initial state for intent classification
        initial_state: AgentState = {
            "messages": messages,
            "intent": "",
            "subject": "",
            "chapter": "",
            "context": "",
            "pyq_results": [],
            "should_fetch_pyq": False
        }
        
        # Run intent classification first
        state = await self._classify_intent(initial_state)
        
        # Fetch PYQs if needed
        if state.get("should_fetch_pyq", False) or state.get("intent") == "pyq_request":
            state = await self._fetch_pyqs(state)
        
        # Build context from PYQ results if available
        pyq_context = ""
        if state.get("pyq_results"):
            pyq_context = "\n\n**Relevant Previous Year Questions:**\n"
            for i, pyq in enumerate(state["pyq_results"], 1):
                pyq_context += f"""
**Question {i}** ({pyq['year']} - {pyq['exam_type']} - {pyq['difficulty'].title()})
Topic: {pyq['topic']}

{pyq['question']}

Options:
A. {pyq['options'][0]}
B. {pyq['options'][1]}
C. {pyq['options'][2]}
D. {pyq['options'][3]}

---
"""
        
        # Create the prompt with context
        context = state.get("context", "") + pyq_context
        system_message = JEE_SYSTEM_PROMPT.format(context=context if context else "No specific context")
        
        # Build messages for streaming
        stream_messages = [SystemMessage(content=system_message)]
        stream_messages.extend(messages)
        
        # Stream the response
        async for chunk in self.llm.astream(stream_messages):
            if chunk.content:
                yield chunk.content


# Singleton instance
_agent_instance: JEEAgent = None


def get_jee_agent() -> JEEAgent:
    """Get or create the JEE agent singleton"""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = JEEAgent()
    return _agent_instance


async def create_jee_agent(api_key: str = None) -> JEEAgent:
    """Create a new JEE agent instance"""
    return JEEAgent(api_key=api_key)
