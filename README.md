# Qur'an Recitation Web Application

A web application to help users read and complete the Qur'an during Ramadan based on personalized goals.

## Technology Stack
- **Frontend**: Next.js 14 (App Router, Tailwind CSS)
- **Backend**: FastAPI (Python)
- **Database**: SQLite (development) / PostgreSQL (production)
- **API**: AlQuran Cloud API

## Features
- Qur'an reading interface (Juz, Surah, Page)
- Ramadan recitation goals (1x, 2x, 3x completion)
- Daily reading plans and progress tracking
- Islamic motivational messages
- Mobile-first responsive design

## Quick Start
1. Backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
2. Frontend: `cd frontend && npm install && npm run dev`
3. Visit: http://localhost:3000