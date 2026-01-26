# Resolve AI - JEE Preparation Platform

A comprehensive JEE preparation platform with AI-powered doubt solving, PYQ practice, study planning, and mentor connect features.

## 🏗️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Database:** SQLite with SQLAlchemy (async)
- **Authentication:** JWT + Google OAuth 2.0
- **Password Hashing:** bcrypt with passlib

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 📁 Project Structure

```
resolve-ai/
├── backend/
│   ├── app/
│   │   ├── db/              # Database files & models
│   │   ├── handlers/        # Business logic handlers
│   │   ├── models/          # Pydantic schemas & SQLAlchemy models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # External services (Google OAuth, etc.)
│   │   ├── utils/           # Utilities & config
│   │   └── main.py          # FastAPI app entry point
│   ├── venv/                # Python virtual environment
│   ├── .env                 # Environment variables (create this)
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── component/           # Reusable UI components
│   ├── lib/                 # Utilities, API client, auth context
│   ├── public/              # Static assets
│   ├── .env.local           # Environment variables (create this)
│   └── package.json         # Node dependencies
└── docs/                    # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/naman9271/resolve-ai.git
cd resolve-ai
```

---

## ⚙️ Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
```

### 2. Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
.\venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Create Environment File

Create a `.env` file in the `backend/` directory:

```bash
touch .env
```

Add the following content to `backend/.env`:

```env
# ===========================================
# RESOLVE AI - BACKEND ENVIRONMENT VARIABLES
# ===========================================

# App Settings
APP_NAME=Resolve AI
APP_VERSION=1.0.0
DEBUG=True

# Server Settings
HOST=0.0.0.0
PORT=8000

# Database (SQLite for development)
# Use absolute path for reliability
DATABASE_URL=sqlite+aiosqlite:////absolute/path/to/resolve-ai/backend/app/db/resolve_ai.db

# JWT Settings (CHANGE IN PRODUCTION!)
SECRET_KEY=your-super-secret-key-change-in-production-use-64-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth 2.0
# Get credentials from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000

# Supabase (Optional - for file storage)
SUPABASE_URL=
SUPABASE_KEY=

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

> ⚠️ **Important:** Replace `/absolute/path/to/resolve-ai/` with your actual project path.  
> Example: `DATABASE_URL=sqlite+aiosqlite:////Users/username/resolve-ai/backend/app/db/resolve_ai.db`

### 5. Run the Backend Server

```bash
cd backend
source venv/bin/activate  # if not already activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create Environment File

Create a `.env.local` file in the `frontend/` directory:

```bash
touch .env.local
```

Add the following content to `frontend/.env.local`:

```env
# ===========================================
# RESOLVE AI - FRONTEND ENVIRONMENT VARIABLES
# ===========================================

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth Client ID (same as backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Run the Frontend Server

```bash
cd frontend
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## 🔐 Setting Up Google OAuth

To enable "Login with Google" functionality:

### 1. Go to Google Cloud Console

Visit: https://console.cloud.google.com/

### 2. Create a New Project (or select existing)

### 3. Enable OAuth 2.0

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add the following:

**Authorized JavaScript origins:**
```
http://localhost:3000
http://localhost:8000
```

**Authorized redirect URIs:**
```
http://localhost:8000/api/v1/auth/google/callback
```

### 4. Copy Credentials

Copy the **Client ID** and **Client Secret** to both:
- `backend/.env` → `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `frontend/.env.local` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

---

## 🏃 Running the Full Application

### Terminal 1 - Backend

```bash
cd resolve-ai/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend

```bash
cd resolve-ai/frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📚 Available Features

### For Students
- 📝 **Register/Login** - Email/password or Google OAuth
- 🤖 **AI Doubt Solver** - Get instant help with JEE problems
- 📊 **PYQ Practice** - Chapter-wise previous year questions
- 📅 **Study Planner** - Plan and track daily study goals
- 👤 **Profile** - View stats, streak, and progress
- 👨‍🏫 **Mentor Connect** - Find verified IITian mentors

### For Mentors
- ✅ **Verification** - Submit JEE credentials for verification
- 💼 **Profile** - Showcase expertise and availability
- 📈 **Dashboard** - Track sessions and earnings

---

## 🛠️ Development Commands

### Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Install new package
pip install package-name

# Freeze dependencies
pip freeze > requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

---

## 🔧 Troubleshooting

### Backend Issues

**"bcrypt" module error:**
```bash
pip install "bcrypt==3.2.2"
```

**Database connection error:**
- Ensure `DATABASE_URL` in `.env` uses an **absolute path**
- Check that the `app/db/` directory exists

**Google OAuth "missing client_id":**
- Verify `.env` file is in the `backend/` directory
- Check that `GOOGLE_CLIENT_ID` is set correctly

### Frontend Issues

**Module not found:**
```bash
npm install
```

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 📄 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database connection string | ✅ |
| `SECRET_KEY` | JWT signing key (min 32 chars) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |
| `DEBUG` | Enable debug mode | ❌ |
| `SUPABASE_URL` | Supabase project URL | ❌ |
| `SUPABASE_KEY` | Supabase anon key | ❌ |

### Frontend (`frontend/.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is private and proprietary.

---

## 👥 Team

- **Backend & Database:** Daksh Pathak
- **Frontend:** [Team Member]
- **AI/ML:** [Team Member]

---

Built with ❤️ for JEE Aspirants
