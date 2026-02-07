@echo off
echo Starting Quran App - Frontend and Backend...

REM Start backend in a new window
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Both servers are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window (servers will continue running)
pause >nul