# Setup Instructions

## Backend Setup (FastAPI)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```
   Server runs on: http://localhost:8000

## Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   App runs on: http://localhost:3000

## Quick Start Script (Windows)

Create `start.bat` in project root:
```batch
@echo off
echo Starting Qur'an App...

start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload"

timeout /t 5

start cmd /k "cd frontend && npm install && npm run dev"

echo Both servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
```

## Features Available

✅ **Goal Selection**: Choose 1x, 2x, 3x, or 5x Quran completion
✅ **Daily Planning**: Automatic Juz assignment per day
✅ **Progress Tracking**: Mark Juz as completed
✅ **Statistics**: View completion percentage and remaining Juz
✅ **Quran Reader**: Read Arabic text with proper typography
✅ **Calendar View**: 30-day visual progress calendar
✅ **Motivational Messages**: Islamic quotes and encouragement
✅ **Responsive Design**: Mobile-first UI
✅ **Offline Storage**: SQLite database for local development

## Production Deployment

### Backend (FastAPI)
- Use PostgreSQL instead of SQLite
- Add environment variables for database URL
- Deploy to Heroku, Railway, or DigitalOcean

### Frontend (Next.js)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update API base URL for production

## API Integration

The app uses AlQuran Cloud API for Quran content:
- Base URL: https://api.alquran.cloud/v1/
- No API key required
- Supports Arabic text, translations, and audio