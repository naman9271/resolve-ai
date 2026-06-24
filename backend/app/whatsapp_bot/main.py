"""
Resolve AI WhatsApp Bot - Twilio Integration
A comprehensive WhatsApp bot for JEE aspirants with all platform features
"""
import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from functools import lru_cache

from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
from pydantic import BaseModel

from app.utils.config import settings
from app.ai.agent import get_jee_agent, JEEAgent
from app.ai.pyq_database import get_pyq_database, PYQDatabase


# ==================== Configuration ====================

router = APIRouter()

# Twilio configuration (add these to your .env file)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")

# Initialize Twilio client
twilio_client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


# ==================== User Session Management ====================

class UserSession:
    """Manages user sessions and conversation history"""
    
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.conversation_history: Dict[str, list] = {}
    
    def get_session(self, phone_number: str) -> Dict[str, Any]:
        """Get or create a user session"""
        if phone_number not in self.sessions:
            self.sessions[phone_number] = {
                "phone": phone_number,
                "state": "main_menu",
                "current_subject": None,
                "current_chapter": None,
                "quiz_score": 0,
                "quiz_total": 0,
                "quiz_questions": [],
                "quiz_index": 0,
                "last_activity": datetime.now(),
                "streak_days": 0,
                "questions_solved": 0,
                "daily_target": 10,
                "preferred_subject": None,
                "registered": False,
                "name": None,
                "target_exam": "JEE Main",
                "target_year": 2026
            }
        else:
            self.sessions[phone_number]["last_activity"] = datetime.now()
        return self.sessions[phone_number]
    
    def get_history(self, phone_number: str) -> list:
        """Get conversation history for a user"""
        if phone_number not in self.conversation_history:
            self.conversation_history[phone_number] = []
        return self.conversation_history[phone_number][-10:]  # Keep last 10 messages
    
    def add_to_history(self, phone_number: str, role: str, content: str):
        """Add message to conversation history"""
        if phone_number not in self.conversation_history:
            self.conversation_history[phone_number] = []
        self.conversation_history[phone_number].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        # Keep only last 20 messages
        if len(self.conversation_history[phone_number]) > 20:
            self.conversation_history[phone_number] = self.conversation_history[phone_number][-20:]
    
    def clear_history(self, phone_number: str):
        """Clear conversation history"""
        self.conversation_history[phone_number] = []
    
    def update_session(self, phone_number: str, **kwargs):
        """Update session data"""
        session = self.get_session(phone_number)
        session.update(kwargs)


# Global session manager
session_manager = UserSession()


# ==================== Message Templates ====================

class MessageTemplates:
    """Pre-defined message templates for consistent responses"""
    
    WELCOME = """🎓 *Welcome to Resolve AI!*

Hey there, JEE Aspirant! 👋

I'm your personal AI study companion, here to help you crack JEE with confidence! 🚀

*What I can do for you:*
📚 Solve doubts instantly
📝 Practice with PYQs (Previous Year Questions)
🧠 Get AI-powered explanations
📊 Track your progress
💡 Daily tips & motivation

Type *menu* to see all options or just ask me any JEE question!

_Let's conquer JEE together!_ 💪"""

    MAIN_MENU = """📱 *RESOLVE AI - Main Menu*

Choose an option:

1️⃣ *Ask a Doubt* 🤔
   → Get instant AI explanations

2️⃣ *PYQ Practice* 📝
   → Previous Year Questions

3️⃣ *Quick Quiz* 🎯
   → Test your knowledge

4️⃣ *Resource Hub* 📚
   → Study materials & notes

5️⃣ *My Progress* 📊
   → Track your preparation

6️⃣ *Daily Planner* 📅
   → Study schedule

7️⃣ *Motivation* 💪
   → Get inspired!

8️⃣ *Settings* ⚙️
   → Customize your experience

━━━━━━━━━━━━━━━━━━━━━
💡 *Pro tip:* Just type your question anytime to get instant help!

_Reply with the number or keyword_"""

    SUBJECTS_MENU = """📚 *Select Subject*

Choose the subject you want to practice:

1️⃣ *Physics* ⚡
   → Mechanics, Thermo, EM, Optics, Modern Physics

2️⃣ *Chemistry* 🧪
   → Physical, Organic, Inorganic

3️⃣ *Mathematics* ➗
   → Calculus, Algebra, Coordinate, Probability

4️⃣ *All Subjects* 📚
   → Mixed practice

0️⃣ *Back* ⬅️
   → Return to main menu

_Reply with the number_"""

    PHYSICS_CHAPTERS = """⚡ *Physics Chapters*

1️⃣ Mechanics
2️⃣ Thermodynamics  
3️⃣ Electromagnetism
4️⃣ Optics
5️⃣ Modern Physics
6️⃣ Waves & Sound
7️⃣ Rotational Motion
8️⃣ All Chapters (Random)

0️⃣ *Back* ⬅️

_Reply with the number_"""

    CHEMISTRY_CHAPTERS = """🧪 *Chemistry Chapters*

1️⃣ Physical Chemistry
2️⃣ Organic Chemistry
3️⃣ Inorganic Chemistry
4️⃣ Electrochemistry
5️⃣ Chemical Kinetics
6️⃣ Coordination Compounds
7️⃣ All Chapters (Random)

0️⃣ *Back* ⬅️

_Reply with the number_"""

    MATHS_CHAPTERS = """➗ *Mathematics Chapters*

1️⃣ Calculus
2️⃣ Algebra
3️⃣ Coordinate Geometry
4️⃣ Trigonometry
5️⃣ Probability & Statistics
6️⃣ Vectors & 3D
7️⃣ All Chapters (Random)

0️⃣ *Back* ⬅️

_Reply with the number_"""

    DIFFICULTY_MENU = """🎯 *Select Difficulty*

1️⃣ *Easy* 🟢
   → Basic concepts & fundamentals

2️⃣ *Medium* 🟡
   → JEE Main level

3️⃣ *Hard* 🔴
   → JEE Advanced level

4️⃣ *Mixed* 🎲
   → Random difficulty

0️⃣ *Back* ⬅️

_Reply with the number_"""

    RESOURCE_HUB = """📚 *Resource Hub*

Access premium study materials:

1️⃣ *Formula Sheets* 📋
   → Quick reference guides

2️⃣ *Concept Notes* 📖
   → Chapter-wise summaries

3️⃣ *Video Lectures* 🎥
   → Topic explanations

4️⃣ *Solved Examples* ✍️
   → Step-by-step solutions

5️⃣ *Mock Tests* 📝
   → Full-length practice tests

6️⃣ *Important Topics* ⭐
   → High-weightage chapters

━━━━━━━━━━━━━━━━━━━━━
🔗 *Quick Links:*

📌 Physics Formulas: https://resolve.ai/physics-formulas
📌 Chemistry Notes: https://resolve.ai/chem-notes  
📌 Math Shortcuts: https://resolve.ai/math-tricks
📌 PYQ Analysis: https://resolve.ai/pyq-analysis

0️⃣ *Back* ⬅️ - Return to menu

_Reply with the number_"""

    DAILY_PLANNER = """📅 *Daily Planner*

📆 *Today's Schedule:*

⏰ *Morning (6 AM - 12 PM)*
├─ 📖 New concept learning
├─ 🧮 Practice problems
└─ ☕ Short breaks

⏰ *Afternoon (2 PM - 6 PM)*
├─ 📝 PYQ Practice
├─ 🔁 Revision of weak topics
└─ ❓ Doubt clearing

⏰ *Evening (7 PM - 10 PM)*
├─ 📊 Mock test / Quiz
├─ 📋 Formula revision
└─ 🎯 Next day planning

━━━━━━━━━━━━━━━━━━━━━
📊 *Your Daily Targets:*
• Questions to solve: 50
• Topics to cover: 3
• PYQs to practice: 20
• Time goal: 8 hours

💡 Type *set target <number>* to change daily goals

0️⃣ *Back* ⬅️

_Reply with the number_"""

    SETTINGS_MENU = """⚙️ *Settings*

Customize your experience:

1️⃣ *Change Name* 👤
   → Update your profile

2️⃣ *Target Exam* 🎯
   → JEE Main / JEE Advanced

3️⃣ *Target Year* 📅
   → Set exam year

4️⃣ *Daily Reminder* ⏰
   → Set study reminders

5️⃣ *Preferred Subject* 📚
   → Set default subject

6️⃣ *Reset Progress* 🔄
   → Start fresh

0️⃣ *Back* ⬅️

_Reply with the number_"""

    HELP_MESSAGE = """❓ *Help & Commands*

*Quick Commands:*
• `menu` - Show main menu
• `doubt` - Ask a doubt
• `pyq` - Practice PYQs
• `quiz` - Start quick quiz
• `resources` - Study materials
• `progress` - View your stats
• `motivation` - Get inspired
• `help` - Show this message
• `clear` - Reset conversation

*Subject shortcuts:*
• `phy` - Physics
• `chem` - Chemistry  
• `math` - Mathematics

*PYQ shortcuts:*
• `pyq phy mechanics`
• `pyq chem organic`
• `pyq math calculus`

*Examples:*
• "Explain Newton's laws"
• "Solve this integration..."
• "Give me PYQs on thermodynamics"
• "What is Faraday's law?"

━━━━━━━━━━━━━━━━━━━━━
📞 *Need more help?*
Email: support@resolve.ai
Website: https://resolve.ai

0️⃣ *Back to Menu* ⬅️"""

    @staticmethod
    def get_motivation():
        """Return a random motivation quote"""
        quotes = [
            "🌟 *\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"*\n\n- Winston Churchill\n\n💪 Keep pushing, you're closer than you think!",
            
            "🔥 *\"The only way to do great work is to love what you do.\"*\n\n- Steve Jobs\n\n📚 Your dedication to JEE shows your passion!",
            
            "⭐ *\"Believe you can and you're halfway there.\"*\n\n- Theodore Roosevelt\n\n🎯 Your IIT dream is achievable!",
            
            "💎 *\"Hard work beats talent when talent doesn't work hard.\"*\n\n- Tim Notke\n\n📈 Consistency is your superpower!",
            
            "🚀 *\"The future belongs to those who believe in the beauty of their dreams.\"*\n\n- Eleanor Roosevelt\n\n🏆 Your JEE success story is being written!",
            
            "💪 *\"It does not matter how slowly you go as long as you do not stop.\"*\n\n- Confucius\n\n📖 Every problem solved is progress!",
            
            "🎯 *\"Success is the sum of small efforts repeated day in and day out.\"*\n\n- Robert Collier\n\n✨ Your daily practice WILL pay off!",
            
            "🌈 *\"The expert in anything was once a beginner.\"*\n\n- Helen Hayes\n\n📚 Every topper started just like you!",
            
            "⚡ *\"Don't watch the clock; do what it does. Keep going.\"*\n\n- Sam Levenson\n\n⏰ Time invested in study is never wasted!",
            
            "🔥 *\"The pain of discipline is far less than the pain of regret.\"*\n\n- Sarah Bombell\n\n💯 Choose the temporary struggle for permanent success!"
        ]
        import random
        return random.choice(quotes)

    @staticmethod
    def get_progress_report(session: dict) -> str:
        """Generate a progress report for the user"""
        return f"""📊 *Your Progress Report*

👤 *Student:* {session.get('name', 'JEE Aspirant')}
🎯 *Target:* {session.get('target_exam', 'JEE Main')} {session.get('target_year', 2026)}

━━━━━━━━━━━━━━━━━━━━━
📈 *Statistics:*

🔥 Current Streak: *{session.get('streak_days', 0)} days*
📝 Questions Solved: *{session.get('questions_solved', 0)}*
🎯 Daily Target: *{session.get('daily_target', 10)} questions*
✅ Quiz Score: *{session.get('quiz_score', 0)}/{session.get('quiz_total', 0)}*

━━━━━━━━━━━━━━━━━━━━━
📚 *Subject-wise Progress:*

⚡ Physics: ████████░░ 80%
🧪 Chemistry: ██████░░░░ 60%
➗ Mathematics: ███████░░░ 70%

━━━━━━━━━━━━━━━━━━━━━
💡 *Tip:* Practice more Chemistry to improve overall score!

🏆 *Achievements:*
• 🔥 First Streak - Completed!
• 📝 100 Questions - In Progress
• 🎯 Quiz Master - 8/10

Keep going! You're doing great! 💪"""

    @staticmethod
    def format_pyq(question: dict, show_answer: bool = False) -> str:
        """Format a PYQ question for WhatsApp"""
        q_text = f"""📝 *PYQ - {question['exam_type']} {question['year']}*

📚 *Subject:* {question['subject']}
📖 *Chapter:* {question['chapter']}
🏷️ *Topic:* {question['topic']}
⚡ *Difficulty:* {question['difficulty'].capitalize()}

━━━━━━━━━━━━━━━━━━━━━
❓ *Question:*

{question['question']}

*Options:*
A) {question['options'][0]}
B) {question['options'][1]}
C) {question['options'][2]}
D) {question['options'][3]}

━━━━━━━━━━━━━━━━━━━━━
💡 *Hint:* {question.get('hint', 'Think carefully!')}

_Reply with A, B, C, or D_
_Or type 'solution' for the answer_"""

        if show_answer:
            answer_letters = ['A', 'B', 'C', 'D']
            correct = answer_letters[question['correct_answer']]
            q_text += f"""

━━━━━━━━━━━━━━━━━━━━━
✅ *Correct Answer:* {correct}) {question['options'][question['correct_answer']]}

📖 *Solution:*
{question['solution']}"""
        
        return q_text


# ==================== Bot Logic ====================

class ResolveAIBot:
    """Main bot class handling all message processing"""
    
    def __init__(self):
        self.templates = MessageTemplates()
        self.pyq_db = get_pyq_database()
        self.ai_agent = None
        self._init_ai_agent()
    
    def _init_ai_agent(self):
        """Initialize the AI agent"""
        try:
            self.ai_agent = get_jee_agent()
        except Exception as e:
            print(f"⚠️ AI Agent initialization failed: {e}")
            self.ai_agent = None
    
    async def process_message(self, phone_number: str, message: str) -> str:
        """Process incoming message and generate response"""
        
        session = session_manager.get_session(phone_number)
        message = message.strip()
        message_lower = message.lower()
        
        # Add to conversation history
        session_manager.add_to_history(phone_number, "user", message)
        
        # Handle global commands first
        response = self._handle_global_commands(message_lower, session)
        if response:
            session_manager.add_to_history(phone_number, "assistant", response)
            return response
        
        # State-based message handling
        state = session.get("state", "main_menu")
        
        if state == "main_menu":
            response = await self._handle_main_menu(message_lower, session, phone_number)
        elif state == "asking_doubt":
            response = await self._handle_doubt(message, session, phone_number)
        elif state == "subjects_menu":
            response = self._handle_subjects_menu(message_lower, session)
        elif state == "physics_chapters":
            response = self._handle_chapter_selection(message_lower, session, "Physics")
        elif state == "chemistry_chapters":
            response = self._handle_chapter_selection(message_lower, session, "Chemistry")
        elif state == "maths_chapters":
            response = self._handle_chapter_selection(message_lower, session, "Mathematics")
        elif state == "difficulty_menu":
            response = self._handle_difficulty_selection(message_lower, session)
        elif state == "quiz_active":
            response = self._handle_quiz_answer(message_lower, session)
        elif state == "settings":
            response = self._handle_settings(message_lower, session, phone_number)
        elif state == "waiting_name":
            response = self._handle_name_input(message, session)
        elif state == "waiting_target_exam":
            response = self._handle_target_exam_input(message_lower, session)
        elif state == "waiting_target_year":
            response = self._handle_target_year_input(message, session)
        elif state == "resource_hub":
            response = self._handle_resource_hub(message_lower, session)
        else:
            # Default: try to answer as a doubt
            response = await self._handle_doubt(message, session, phone_number)
        
        session_manager.add_to_history(phone_number, "assistant", response)
        return response
    
    def _handle_global_commands(self, message: str, session: dict) -> Optional[str]:
        """Handle commands that work from any state"""
        
        # Menu command
        if message in ['menu', 'main', 'home', '0', 'back', 'exit']:
            session_manager.update_session(session['phone'], state="main_menu")
            return self.templates.MAIN_MENU
        
        # Help command
        if message in ['help', '?', 'commands']:
            return self.templates.HELP_MESSAGE
        
        # Clear conversation
        if message in ['clear', 'reset', 'start over']:
            session_manager.clear_history(session['phone'])
            session_manager.update_session(session['phone'], state="main_menu")
            return "🔄 Conversation cleared!\n\n" + self.templates.MAIN_MENU
        
        # Motivation shortcut
        if message in ['motivation', 'inspire', 'motivate', 'quote']:
            return self.templates.get_motivation()
        
        # Progress shortcut
        if message in ['progress', 'stats', 'my progress', 'status']:
            return self.templates.get_progress_report(session)
        
        # Quick subject shortcuts
        if message in ['phy', 'physics']:
            session_manager.update_session(session['phone'], state="physics_chapters", current_subject="Physics")
            return self.templates.PHYSICS_CHAPTERS
        
        if message in ['chem', 'chemistry']:
            session_manager.update_session(session['phone'], state="chemistry_chapters", current_subject="Chemistry")
            return self.templates.CHEMISTRY_CHAPTERS
        
        if message in ['math', 'maths', 'mathematics']:
            session_manager.update_session(session['phone'], state="maths_chapters", current_subject="Mathematics")
            return self.templates.MATHS_CHAPTERS
        
        # Hi/Hello - Show welcome
        if message in ['hi', 'hello', 'hey', 'start', 'hii', 'helo']:
            return self.templates.WELCOME
        
        return None
    
    async def _handle_main_menu(self, message: str, session: dict, phone_number: str) -> str:
        """Handle main menu selections"""
        
        # Ask a doubt
        if message in ['1', 'doubt', 'ask', 'question', 'ask doubt', 'ask a doubt']:
            session_manager.update_session(phone_number, state="asking_doubt")
            return """🤔 *Ask Your Doubt*

Go ahead, type your JEE question or doubt! 

I can help you with:
• 📚 Concept explanations
• ✍️ Problem solving
• 🔬 Theory questions
• 📐 Numerical problems

_Just type your question..._

💡 Tip: Be specific for better answers!

Type *menu* to go back."""
        
        # PYQ Practice
        if message in ['2', 'pyq', 'pyqs', 'previous year', 'practice']:
            session_manager.update_session(phone_number, state="subjects_menu")
            return self.templates.SUBJECTS_MENU
        
        # Quick Quiz
        if message in ['3', 'quiz', 'test', 'quick quiz']:
            session_manager.update_session(phone_number, state="subjects_menu")
            return "🎯 *Quick Quiz Mode*\n\n" + self.templates.SUBJECTS_MENU
        
        # Resource Hub
        if message in ['4', 'resources', 'resource', 'materials', 'notes', 'resource hub']:
            session_manager.update_session(phone_number, state="resource_hub")
            return self.templates.RESOURCE_HUB
        
        # My Progress
        if message in ['5', 'progress', 'my progress', 'stats']:
            return self.templates.get_progress_report(session)
        
        # Daily Planner
        if message in ['6', 'planner', 'schedule', 'daily', 'daily planner']:
            return self.templates.DAILY_PLANNER
        
        # Motivation
        if message in ['7', 'motivation', 'motivate', 'inspire']:
            return self.templates.get_motivation()
        
        # Settings
        if message in ['8', 'settings', 'setting', 'preferences']:
            session_manager.update_session(phone_number, state="settings")
            return self.templates.SETTINGS_MENU
        
        # If nothing matched, treat as a doubt
        return await self._handle_doubt(message, session, phone_number)
    
    async def _handle_doubt(self, message: str, session: dict, phone_number: str) -> str:
        """Handle doubt/question using AI agent"""
        
        if not self.ai_agent:
            return """⚠️ *AI Service Temporarily Unavailable*

Sorry, the AI is taking a short break! 😅

In the meantime, you can:
• 📝 Practice PYQs (type *pyq*)
• 📚 Check resources (type *resources*)
• 🎯 Take a quiz (type *quiz*)

_Please try again in a few minutes!_"""
        
        try:
            # Get conversation history
            history = session_manager.get_history(phone_number)
            formatted_history = [
                {"role": msg["role"], "content": msg["content"]} 
                for msg in history[:-1]  # Exclude current message
            ]
            
            # Get AI response
            response = await self.ai_agent.chat(message, formatted_history)
            
            # Update stats
            session['questions_solved'] = session.get('questions_solved', 0) + 1
            session_manager.update_session(phone_number, questions_solved=session['questions_solved'])
            
            # Format response for WhatsApp
            formatted_response = f"""🤖 *Resolve AI*

{response}

━━━━━━━━━━━━━━━━━━━━━
💡 *Follow-up options:*
• Type more questions
• Type *pyq* for related PYQs
• Type *menu* for main menu"""
            
            return formatted_response
            
        except Exception as e:
            print(f"AI Error: {e}")
            return """❌ *Oops! Something went wrong*

I couldn't process that question. Let's try again!

*Tips:*
• Make sure your question is clear
• Try rephrasing it
• Check for any typos

Type your question again or type *menu* to go back."""
    
    def _handle_subjects_menu(self, message: str, session: dict) -> str:
        """Handle subject selection"""
        phone = session['phone']
        
        if message in ['1', 'physics', 'phy']:
            session_manager.update_session(phone, state="physics_chapters", current_subject="Physics")
            return self.templates.PHYSICS_CHAPTERS
        
        elif message in ['2', 'chemistry', 'chem']:
            session_manager.update_session(phone, state="chemistry_chapters", current_subject="Chemistry")
            return self.templates.CHEMISTRY_CHAPTERS
        
        elif message in ['3', 'mathematics', 'maths', 'math']:
            session_manager.update_session(phone, state="maths_chapters", current_subject="Mathematics")
            return self.templates.MATHS_CHAPTERS
        
        elif message in ['4', 'all', 'random']:
            session_manager.update_session(phone, state="difficulty_menu", current_subject=None, current_chapter=None)
            return self.templates.DIFFICULTY_MENU
        
        elif message in ['0', 'back']:
            session_manager.update_session(phone, state="main_menu")
            return self.templates.MAIN_MENU
        
        return "❓ Invalid option. " + self.templates.SUBJECTS_MENU
    
    def _handle_chapter_selection(self, message: str, session: dict, subject: str) -> str:
        """Handle chapter selection for a subject"""
        phone = session['phone']
        
        chapter_map = {
            "Physics": {
                "1": "Mechanics", "2": "Thermodynamics", "3": "Electromagnetism",
                "4": "Optics", "5": "Modern Physics", "6": "Waves",
                "7": "Rotational Motion", "8": None
            },
            "Chemistry": {
                "1": "Physical Chemistry", "2": "Organic Chemistry", "3": "Inorganic Chemistry",
                "4": "Electrochemistry", "5": "Chemical Kinetics", "6": "Coordination Compounds",
                "7": None
            },
            "Mathematics": {
                "1": "Calculus", "2": "Algebra", "3": "Coordinate Geometry",
                "4": "Trigonometry", "5": "Probability", "6": "Vectors",
                "7": None
            }
        }
        
        if message in ['0', 'back']:
            session_manager.update_session(phone, state="subjects_menu")
            return self.templates.SUBJECTS_MENU
        
        if subject in chapter_map and message in chapter_map[subject]:
            chapter = chapter_map[subject][message]
            session_manager.update_session(phone, state="difficulty_menu", current_chapter=chapter)
            return self.templates.DIFFICULTY_MENU
        
        return "❓ Invalid option. Please choose a valid chapter number."
    
    def _handle_difficulty_selection(self, message: str, session: dict) -> str:
        """Handle difficulty selection and start quiz/PYQ"""
        phone = session['phone']
        
        difficulty_map = {
            "1": "easy", "2": "medium", "3": "hard", "4": None
        }
        
        if message in ['0', 'back']:
            session_manager.update_session(phone, state="subjects_menu")
            return self.templates.SUBJECTS_MENU
        
        if message in difficulty_map:
            difficulty = difficulty_map[message]
            
            # Get PYQs based on selection
            questions = self.pyq_db.get_questions(
                subject=session.get('current_subject'),
                chapter=session.get('current_chapter'),
                difficulty=difficulty,
                limit=5
            )
            
            if not questions:
                return """😅 *No questions found*

Sorry, I couldn't find questions matching your criteria.

Try:
• Different chapter
• Different difficulty
• All subjects option

Type *menu* to start over."""
            
            # Start quiz
            session_manager.update_session(
                phone,
                state="quiz_active",
                quiz_questions=questions,
                quiz_index=0,
                quiz_score=0,
                quiz_total=len(questions)
            )
            
            # Return first question
            return self._format_quiz_question(session, questions[0])
        
        return "❓ Invalid option. " + self.templates.DIFFICULTY_MENU
    
    def _format_quiz_question(self, session: dict, question: dict) -> str:
        """Format a quiz question"""
        index = session.get('quiz_index', 0) + 1
        total = session.get('quiz_total', 1)
        
        return f"""🎯 *Quiz Question {index}/{total}*

📚 {question['subject']} | {question['chapter']}
⚡ Difficulty: {question['difficulty'].capitalize()}

━━━━━━━━━━━━━━━━━━━━━
❓ {question['question']}

*A)* {question['options'][0]}
*B)* {question['options'][1]}
*C)* {question['options'][2]}
*D)* {question['options'][3]}

━━━━━━━━━━━━━━━━━━━━━
💡 Hint: {question.get('hint', 'Think carefully!')}

_Reply with A, B, C, or D_
_Type 'skip' to skip | 'quit' to end quiz_"""
    
    def _handle_quiz_answer(self, message: str, session: dict) -> str:
        """Handle quiz answer"""
        phone = session['phone']
        questions = session.get('quiz_questions', [])
        index = session.get('quiz_index', 0)
        
        if not questions or index >= len(questions):
            session_manager.update_session(phone, state="main_menu")
            return "Quiz ended! " + self.templates.MAIN_MENU
        
        current_question = questions[index]
        answer_map = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
        
        # Handle quit
        if message in ['quit', 'end', 'stop', 'exit quiz']:
            return self._end_quiz(session)
        
        # Handle skip
        if message in ['skip', 'next']:
            return self._next_question(session)
        
        # Handle solution request
        if message in ['solution', 'answer', 'show answer']:
            answer_letters = ['A', 'B', 'C', 'D']
            correct = answer_letters[current_question['correct_answer']]
            return f"""📖 *Solution*

✅ *Correct Answer:* {correct}) {current_question['options'][current_question['correct_answer']]}

📝 *Explanation:*
{current_question['solution']}

━━━━━━━━━━━━━━━━━━━━━
_Type 'next' for next question or 'quit' to end_"""
        
        # Check answer
        if message in answer_map:
            user_answer = answer_map[message]
            correct_answer = current_question['correct_answer']
            
            if user_answer == correct_answer:
                session['quiz_score'] = session.get('quiz_score', 0) + 1
                session_manager.update_session(phone, quiz_score=session['quiz_score'])
                result = "✅ *Correct!* 🎉\n\n"
            else:
                answer_letters = ['A', 'B', 'C', 'D']
                result = f"❌ *Incorrect!*\n\n✅ Correct answer: *{answer_letters[correct_answer]}*\n\n"
            
            result += f"📝 *Explanation:*\n{current_question['solution']}"
            
            # Check if quiz is complete
            if index + 1 >= len(questions):
                return result + "\n\n" + self._end_quiz(session)
            
            # Move to next question
            session_manager.update_session(phone, quiz_index=index + 1)
            result += "\n\n━━━━━━━━━━━━━━━━━━━━━\n_Type 'next' for next question_"
            return result
        
        return "❓ Please reply with *A*, *B*, *C*, or *D*\n\nOr type *skip* to skip | *quit* to end quiz"
    
    def _next_question(self, session: dict) -> str:
        """Move to next quiz question"""
        phone = session['phone']
        questions = session.get('quiz_questions', [])
        index = session.get('quiz_index', 0)
        
        if index + 1 >= len(questions):
            return self._end_quiz(session)
        
        session_manager.update_session(phone, quiz_index=index + 1)
        return self._format_quiz_question(
            session_manager.get_session(phone),
            questions[index + 1]
        )
    
    def _end_quiz(self, session: dict) -> str:
        """End quiz and show results"""
        phone = session['phone']
        score = session.get('quiz_score', 0)
        total = session.get('quiz_total', 1)
        percentage = (score / total * 100) if total > 0 else 0
        
        # Determine performance message
        if percentage >= 80:
            emoji = "🏆"
            message = "Excellent! You're JEE ready!"
        elif percentage >= 60:
            emoji = "👍"
            message = "Good job! Keep practicing!"
        elif percentage >= 40:
            emoji = "💪"
            message = "Not bad! More practice needed."
        else:
            emoji = "📚"
            message = "Keep studying! You'll improve!"
        
        session_manager.update_session(phone, state="main_menu", quiz_questions=[], quiz_index=0)
        
        return f"""🎯 *Quiz Complete!* {emoji}

━━━━━━━━━━━━━━━━━━━━━
📊 *Your Score: {score}/{total}*
📈 *Percentage: {percentage:.0f}%*

{message}

━━━━━━━━━━━━━━━━━━━━━
*What's next?*
• Type *quiz* for another quiz
• Type *pyq* for more practice
• Type *menu* for main menu

_Keep up the great work!_ 💪"""
    
    def _handle_settings(self, message: str, session: dict, phone_number: str) -> str:
        """Handle settings menu"""
        
        if message in ['1', 'name', 'change name']:
            session_manager.update_session(phone_number, state="waiting_name")
            return "👤 *Change Name*\n\nPlease type your name:"
        
        elif message in ['2', 'exam', 'target exam']:
            session_manager.update_session(phone_number, state="waiting_target_exam")
            return """🎯 *Target Exam*

Select your target exam:

1️⃣ JEE Main
2️⃣ JEE Advanced
3️⃣ Both

_Reply with the number_"""
        
        elif message in ['3', 'year', 'target year']:
            session_manager.update_session(phone_number, state="waiting_target_year")
            return "📅 *Target Year*\n\nEnter your target exam year (e.g., 2025, 2026):"
        
        elif message in ['4', 'reminder', 'reminders']:
            return """⏰ *Daily Reminders*

Reminder feature coming soon! 🚧

We'll notify you:
• Study time reminders
• Daily quiz alerts
• Streak warnings

_Stay tuned!_

Type *menu* to go back."""
        
        elif message in ['5', 'subject', 'preferred subject']:
            session_manager.update_session(phone_number, state="subjects_menu")
            return "📚 *Set Preferred Subject*\n\n" + self.templates.SUBJECTS_MENU
        
        elif message in ['6', 'reset', 'reset progress']:
            session_manager.update_session(
                phone_number,
                quiz_score=0,
                quiz_total=0,
                questions_solved=0,
                streak_days=0
            )
            return """🔄 *Progress Reset*

Your progress has been reset! 

Fresh start, new opportunities! 🌟

Type *menu* to continue."""
        
        elif message in ['0', 'back']:
            session_manager.update_session(phone_number, state="main_menu")
            return self.templates.MAIN_MENU
        
        return "❓ Invalid option. " + self.templates.SETTINGS_MENU
    
    def _handle_name_input(self, message: str, session: dict) -> str:
        """Handle name input"""
        phone = session['phone']
        name = message.strip()[:50]  # Limit name length
        
        session_manager.update_session(phone, name=name, state="main_menu")
        return f"""✅ *Name Updated!*

Welcome, *{name}*! 🎉

Your profile has been updated.

{self.templates.MAIN_MENU}"""
    
    def _handle_target_exam_input(self, message: str, session: dict) -> str:
        """Handle target exam selection"""
        phone = session['phone']
        
        exam_map = {
            '1': 'JEE Main',
            '2': 'JEE Advanced',
            '3': 'JEE Main & Advanced'
        }
        
        if message in exam_map:
            exam = exam_map[message]
            session_manager.update_session(phone, target_exam=exam, state="main_menu")
            return f"""✅ *Target Exam Updated!*

Your target: *{exam}* 🎯

Let's work towards your goal!

{self.templates.MAIN_MENU}"""
        
        return "❓ Please select 1, 2, or 3"
    
    def _handle_target_year_input(self, message: str, session: dict) -> str:
        """Handle target year input"""
        phone = session['phone']
        
        try:
            year = int(message.strip())
            if 2024 <= year <= 2030:
                session_manager.update_session(phone, target_year=year, state="main_menu")
                return f"""✅ *Target Year Updated!*

Your target year: *{year}* 📅

Time to make it happen!

{self.templates.MAIN_MENU}"""
            else:
                return "❓ Please enter a valid year between 2024 and 2030"
        except ValueError:
            return "❓ Please enter a valid year (e.g., 2025, 2026)"
    
    def _handle_resource_hub(self, message: str, session: dict) -> str:
        """Handle resource hub selections"""
        phone = session['phone']
        
        if message in ['0', 'back']:
            session_manager.update_session(phone, state="main_menu")
            return self.templates.MAIN_MENU
        
        resources = {
            '1': {
                'title': '📋 Formula Sheets',
                'content': """📋 *Formula Sheets*

Quick reference formulas for JEE:

⚡ *Physics:*
🔗 https://resolve.ai/formulas/physics

🧪 *Chemistry:*
🔗 https://resolve.ai/formulas/chemistry

➗ *Mathematics:*
🔗 https://resolve.ai/formulas/maths

━━━━━━━━━━━━━━━━━━━━━
📥 Download PDF versions from our website!

Type *0* to go back"""
            },
            '2': {
                'title': '📖 Concept Notes',
                'content': """📖 *Concept Notes*

Chapter-wise detailed notes:

📚 *Available Notes:*

⚡ Physics:
• Mechanics - https://resolve.ai/notes/mechanics
• Thermodynamics - https://resolve.ai/notes/thermo
• Electromagnetism - https://resolve.ai/notes/em

🧪 Chemistry:
• Organic - https://resolve.ai/notes/organic
• Inorganic - https://resolve.ai/notes/inorganic
• Physical - https://resolve.ai/notes/physical

➗ Mathematics:
• Calculus - https://resolve.ai/notes/calculus
• Algebra - https://resolve.ai/notes/algebra

Type *0* to go back"""
            },
            '3': {
                'title': '🎥 Video Lectures',
                'content': """🎥 *Video Lectures*

Watch detailed explanations:

📺 *YouTube Channel:*
🔗 https://youtube.com/resolveai

📺 *Featured Playlists:*
• JEE Physics Complete - 150 videos
• JEE Chemistry Complete - 120 videos
• JEE Mathematics Complete - 180 videos

🎬 *Topic Shorts:*
Quick 5-min concept videos!
🔗 https://resolve.ai/shorts

Type *0* to go back"""
            },
            '4': {
                'title': '✍️ Solved Examples',
                'content': """✍️ *Solved Examples*

Step-by-step problem solutions:

📝 *Categories:*

1. JEE Main Level (500+ problems)
   🔗 https://resolve.ai/solved/main

2. JEE Advanced Level (300+ problems)
   🔗 https://resolve.ai/solved/advanced

3. Tricky Problems (100+ problems)
   🔗 https://resolve.ai/solved/tricky

💡 Tip: Type your problem and I'll solve it!

Type *0* to go back"""
            },
            '5': {
                'title': '📝 Mock Tests',
                'content': """📝 *Mock Tests*

Practice with full-length tests:

🎯 *Available Tests:*

• JEE Main Mock 1-10
  🔗 https://resolve.ai/mock/main

• JEE Advanced Mock 1-5
  🔗 https://resolve.ai/mock/advanced

• Chapter Tests
  🔗 https://resolve.ai/mock/chapters

📊 *Features:*
• Timed tests
• Instant results
• Detailed analysis
• Rank prediction

Type *0* to go back"""
            },
            '6': {
                'title': '⭐ Important Topics',
                'content': """⭐ *High-Weightage Topics*

Focus on these for maximum marks:

⚡ *Physics:*
• Mechanics (30%)
• Electromagnetism (25%)
• Modern Physics (15%)

🧪 *Chemistry:*
• Organic Chemistry (35%)
• Physical Chemistry (30%)
• Inorganic Chemistry (35%)

➗ *Mathematics:*
• Calculus (35%)
• Algebra (25%)
• Coordinate Geometry (20%)

🔗 Full analysis: https://resolve.ai/analysis

Type *0* to go back"""
            }
        }
        
        if message in resources:
            return resources[message]['content']
        
        return self.templates.RESOURCE_HUB


# ==================== Initialize Bot ====================
bot = ResolveAIBot()


# ==================== Twilio Webhook Endpoints ====================

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    Main webhook endpoint for Twilio WhatsApp messages
    """
    try:
        # Parse form data from Twilio
        form_data = await request.form()
        
        # Extract message details
        incoming_msg = form_data.get("Body", "").strip()
        from_number = form_data.get("From", "")
        
        if not incoming_msg or not from_number:
            return Response(content="", media_type="text/xml")
        
        # Process the message
        response_text = await bot.process_message(from_number, incoming_msg)
        
        # Create TwiML response
        twilio_response = MessagingResponse()
        twilio_response.message(response_text)
        
        return Response(
            content=str(twilio_response),
            media_type="text/xml"
        )
        
    except Exception as e:
        print(f"Webhook Error: {e}")
        # Return a friendly error message
        twilio_response = MessagingResponse()
        twilio_response.message("😅 Oops! Something went wrong. Please try again or type *menu* to start over.")
        return Response(
            content=str(twilio_response),
            media_type="text/xml"
        )


@router.get("/webhook")
async def verify_webhook(request: Request):
    """
    Webhook verification endpoint (for testing)
    """
    return {"status": "WhatsApp Bot webhook is active", "version": "1.0.0"}


@router.post("/send")
async def send_message(phone: str, message: str):
    """
    Endpoint to send a message to a user (for notifications, reminders, etc.)
    """
    if not twilio_client:
        raise HTTPException(status_code=500, detail="Twilio client not configured")
    
    try:
        # Format phone number for WhatsApp
        to_number = f"whatsapp:{phone}" if not phone.startswith("whatsapp:") else phone
        
        message = twilio_client.messages.create(
            body=message,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=to_number
        )
        
        return {"status": "sent", "sid": message.sid}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def bot_health():
    """Health check for the WhatsApp bot"""
    return {
        "status": "healthy",
        "service": "Resolve AI WhatsApp Bot",
        "twilio_configured": bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN),
        "ai_agent_available": bot.ai_agent is not None
    }


# ==================== CLI Testing ====================

async def test_bot():
    """Test the bot in CLI mode"""
    print("🤖 Resolve AI WhatsApp Bot - CLI Test Mode")
    print("=" * 50)
    print("Type 'quit' to exit\n")
    
    test_phone = "test_user"
    
    # Send welcome message
    welcome = await bot.process_message(test_phone, "hi")
    print(f"Bot: {welcome}\n")
    
    while True:
        try:
            user_input = input("You: ").strip()
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Goodbye! 👋")
                break
            
            response = await bot.process_message(test_phone, user_input)
            print(f"\nBot: {response}\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye! 👋")
            break
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_bot())
