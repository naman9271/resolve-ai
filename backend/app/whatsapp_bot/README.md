# 📱 Resolve AI WhatsApp Bot

A comprehensive WhatsApp bot for JEE aspirants, powered by Twilio and Google Gemini AI.

## 🌟 Features

### 1. **AI-Powered Doubt Solving** 🤖
- Instant answers to JEE questions
- Step-by-step problem solutions
- Concept explanations
- LaTeX-style mathematical notation

### 2. **PYQ Practice** 📝
- Previous Year Questions from JEE Main & Advanced
- Subject-wise and chapter-wise filtering
- Difficulty levels (Easy, Medium, Hard)
- Instant solutions and explanations

### 3. **Quick Quiz Mode** 🎯
- Timed quizzes on any topic
- Score tracking
- Performance analytics
- Skip and solution options

### 4. **Resource Hub** 📚
- Formula sheets
- Concept notes
- Video lecture links
- Solved examples
- Mock tests

### 5. **Progress Tracking** 📊
- Questions solved counter
- Streak tracking
- Subject-wise progress
- Achievement badges

### 6. **Daily Planner** 📅
- Study schedule templates
- Daily targets
- Personalized recommendations

### 7. **Motivation Corner** 💪
- Inspirational quotes
- Study tips
- Success stories

## 🚀 Setup Guide

### Prerequisites

1. **Twilio Account**
   - Sign up at [twilio.com](https://www.twilio.com)
   - Get a WhatsApp-enabled phone number
   - Note your Account SID and Auth Token

2. **Python Environment**
   - Python 3.9+
   - FastAPI backend running

### Installation

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure Environment Variables**

Add these to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Google AI (for AI-powered responses)
GOOGLE_API_KEY=your_google_api_key_here
```

3. **Configure Twilio Webhook**

In your Twilio Console:
- Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
- Or set up a dedicated WhatsApp number
- Set the webhook URL to: `https://your-domain.com/api/v1/whatsapp/webhook`

### For Local Development

1. **Use ngrok to expose your local server**
```bash
ngrok http 8000
```

2. **Set the ngrok URL in Twilio**
```
https://your-ngrok-url.ngrok.io/api/v1/whatsapp/webhook
```

3. **Start the FastAPI server**
```bash
cd backend
uvicorn app.main:app --reload
```

## 📱 Bot Commands

| Command | Description |
|---------|-------------|
| `hi` / `hello` | Welcome message |
| `menu` | Main menu |
| `doubt` | Ask a doubt |
| `pyq` | PYQ practice |
| `quiz` | Quick quiz |
| `resources` | Study materials |
| `progress` | Your stats |
| `motivation` | Get inspired |
| `help` | All commands |
| `clear` | Reset conversation |

### Subject Shortcuts
| Command | Subject |
|---------|---------|
| `phy` | Physics |
| `chem` | Chemistry |
| `math` | Mathematics |

### PYQ Shortcuts
```
pyq phy mechanics
pyq chem organic
pyq math calculus
```

## 🔧 API Endpoints

### Webhook (Twilio)
```
POST /api/v1/whatsapp/webhook
GET  /api/v1/whatsapp/webhook (verification)
```

### Send Message
```
POST /api/v1/whatsapp/send
Parameters:
  - phone: WhatsApp number
  - message: Message to send
```

### Health Check
```
GET /api/v1/whatsapp/health
```

## 📊 Message Flow

```
┌─────────────┐
│   Student   │
│  WhatsApp   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Twilio    │
│   Gateway   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Resolve AI │
│   Backend   │
└──────┬──────┘
       │
       ├──────────────┐
       ▼              ▼
┌─────────────┐ ┌─────────────┐
│  AI Agent   │ │ PYQ Database│
│  (Gemini)   │ │             │
└─────────────┘ └─────────────┘
```

## 🧪 Testing

### CLI Test Mode
```bash
cd backend
python -m app.whatsapp_bot.main
```

This starts an interactive CLI mode where you can test the bot without Twilio.

### Example Interaction
```
You: hi
Bot: 🎓 Welcome to Resolve AI! ...

You: 1
Bot: 🤔 Ask Your Doubt...

You: Explain Newton's second law
Bot: 🤖 Resolve AI...
```

## 🔒 Security Notes

1. **Never commit** your `.env` file with real credentials
2. **Validate webhook** requests are from Twilio
3. **Rate limit** requests to prevent abuse
4. **Log suspicious** activity

## 📈 Future Enhancements

- [ ] Voice message support
- [ ] Image-based doubt solving
- [ ] Group study rooms
- [ ] Scheduled reminders
- [ ] Parent notifications
- [ ] Mentor connections
- [ ] Payment integration for premium

## 🐛 Troubleshooting

### Bot not responding?
1. Check Twilio webhook URL is correct
2. Verify ngrok is running (for local dev)
3. Check server logs for errors
4. Verify environment variables

### AI responses failing?
1. Check GOOGLE_API_KEY is set
2. Verify API quota hasn't been exceeded
3. Check network connectivity

### Messages not sending?
1. Verify Twilio credentials
2. Check WhatsApp number format (include country code)
3. Ensure recipient has sent a message first (24-hour window)

## 📞 Support

- **Email**: support@resolve.ai
- **Documentation**: https://docs.resolve.ai
- **Issues**: GitHub Issues

---

Made with ❤️ by the Resolve AI Team
