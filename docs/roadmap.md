# Resolve AI

## Our Goal
- to create a one stop platform for JEE students (inspirtion from https://getdisha.ai and rumik.ai)

## Features
- hiring IIT,NIT Tier 1 college students as mentors and they mentor students preparing for JEE
- free mentorship for JEE students as a AI Mentor

- Website 
- Whatsapp Bot

## Website Features
- google oauth + manual entry

- Student login 
  - 11th/12th or Dropper or Partial Dropper or day scholar 
  - dummy school/daily school
  - phone number verification or email verification ❌
  - and for whatsapp bot verify your phone number ❌

- student dashbaord
  - PYQs center ❌
    - previous year questions sorted by chapter and difficulty level (3 series hi de after that paid) ❌
  - Resource Hub
    - free notes, videos, test series ❌

  - Mentor Center
    - AI (free) 
    - Mentor (paid) 99/month (tier 1) iit(199) ❌
    - mentor feedback system 

    - Chatbot-> 1. images se question  ❌
                2. Deepmind -> jee advanced question ❌ 
    - Emotional Support Chatbot (rumik ai inspiration) ❌
   
   - Performance Analysis (1 test free, then paid)
     - test series performance analysis ❌
     - subject wise performance analysis ❌
     - chapter wise performance analysis ❌
    
   - Timetable Ai template bnakr dega user can customize kr skta h ❌
   - habit tracker (daily task decide) 
   - whatsapp pr hi reminders ❌
   - encouragemnet type thing 
   - Question of the day (streak) -> leetcode badges ❌
 
- College Councelling and rank predictor ❌
  - AI Based college counselling and rank predictor based on previous year data of JEE Main and Advanced ❌

- Room Feature 
  - students can create/join rooms based on their preferences (branch, college, location) ❌
  - in rooms students can discuss topics, share resources, and collaborate on projects ❌
  - rooms can be public or private (invite only) ❌


**Mentor** -> (Daksh)
1. Mentor name and photo will NOT be anonymous ✅ (Updated requirement)
2. User can choose his own mentor from the list of available mentors ✅
3. Mentor will be paid on per session basis (30 mins/1 hour) ✅



- Mentor login ✅
  - college verification (iit/nit tier 1) ✅
  - branch ✅
  - year of study ✅
  - phone number verification and college verification ✅
  - jee adv clear or not ✅
  - jee roll number ✅
  - date of birth ✅
  - we are just asking these details for verification purpose 
  (end to end encryption for personal data) ✅

  - we can approve or reject them ✅ (Admin routes created)

  - for initially mentors will be onboarded by us directly
  - mentor dashboard ✅
    - student management ✅
    - schedule meetings ✅
    - payment management ✅

## Mentor System Implementation (Completed)
- **Backend:**
  - MentorProfile model with all verification fields
  - MentorSession model for session tracking
  - Complete mentor routes (`/api/v1/mentors/`)
  - Admin verification routes
  - Session management APIs
  - Earnings tracking APIs

- **Frontend:**
  - `/mentor/login` - Mentor login page with amber theme
  - `/mentor/register` - 5-step registration flow
  - `/mentor/pending-verification` - Waiting for admin approval
  - `/mentor/dashboard` - Complete dashboard with:
    - Overview with stats
    - Session management tab
    - Student management tab  
    - Earnings & payments tab
    - Settings tab

- **Session Rates (Free Plan):**
  - 30 minutes: ₹200
  
- **Session Rates (Pro Plan):**
  - 2 sessions free
  - Additional sessions: ₹100/30 mins

---

## Pricing Plans (April 2026 Attempt)

### Free Plan (₹0)
- WhatsApp Bot: 10 free messages
- Lily (Emotional Support): 10 chats
- Resolve AI: 5 doubts
- Mentor Sessions: ₹200/30min
- Daily Planner: Full access
- Performance Analysis: Includes streak tracking
- 1 Week Full Access Trial
- Formula Sheets: All chapters (11th + 12th)
- Public rooms: Free to create

### Pro Plan (₹500/month)
- All Free Plan features included
- WhatsApp Chatbot: Unlimited access
- Lily (Emotional Support): Unlimited
- Resolve AI: Unlimited doubts
- Live Mentor Support: 2 sessions free + ₹100/30min for additional
- Group Study: Unlimited rooms
- Multilingual Support
- Paid College Counselling Access
- Future: PYQ Test Series, Paid Lectures

---

## Cost Structure
- Backend server: ~₹2000/month (scales with usage)
- WhatsApp API: ~₹5000 for initial 500 users (avg 50 messages/user)
- Mentor payout: 50% of fee + bonus based on consistency & reviews

---

## Whatsapp Bot (multiple numbers)

 1. Main Chatbot (7 days free + 5 prompts free) --help ❌
    Q. give me the pyqs of maths trigono
    Ans. Top 5 questions of maths trigonometry from previous year questions. [links]
         anything else
    Q. what marks needed for nit trichy jee main
    Ans. Based on previous year data, you need approx 250 marks in jee main

 2. Mental Support Chatbot (rumik ai clone) ❌

 3. Mentor Chatbot (paid) 
 


## Mobile App (Future Scope)
- mentee / mentor app ❌

- meeting/call ❌
- mentor chat
- all website features
