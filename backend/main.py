from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from passlib.context import CryptContext
import httpx
from typing import Optional
import jwt
import secrets

SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SQLALCHEMY_DATABASE_URL = "sqlite:///./quran_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    ramadan_goal = Column(Integer, default=1)
    ramadan_start_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    juz_number = Column(Integer, nullable=True)
    surah_number = Column(Integer, nullable=True)
    page_number = Column(Integer, nullable=True)
    day_number = Column(Integer)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

Base.metadata.create_all(bind=engine)

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserGoal(BaseModel):
    ramadan_goal: int
    ramadan_start_date: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    name: str

class ProgressUpdate(BaseModel):
    juz_number: Optional[int] = None
    surah_number: Optional[int] = None
    page_number: Optional[int] = None
    day_number: int
    completed: bool

app = FastAPI(title="Qur'an Recitation API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_token(user_id: int):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=30)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

MOTIVATIONAL_MESSAGES = [
    "The Qur'an is a healing for what is in the hearts. - Quran 17:82",
    "And We send down of the Qur'an that which is healing and mercy.",
    "This is the Book about which there is no doubt. - Quran 2:2",
    "Ramadan Mubarak! Continue your blessed journey with the Qur'an.",
    "Every verse you recite brings you closer to Allah.",
]

@app.post("/signup", response_model=Token)
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(email=user.email, password=hashed_password, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    token = create_token(db_user.id)
    return {"access_token": token, "token_type": "bearer", "user_id": db_user.id, "name": db_user.name}

@app.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(db_user.id)
    return {"access_token": token, "token_type": "bearer", "user_id": db_user.id, "name": db_user.name}

@app.get("/me")
def get_current_user(user_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "name": user.name, "ramadan_goal": user.ramadan_goal, "ramadan_start_date": user.ramadan_start_date}

@app.post("/set-goal")
def set_goal(goal: UserGoal, user_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.ramadan_goal = goal.ramadan_goal
    user.ramadan_start_date = goal.ramadan_start_date
    db.commit()
    return {"message": "Goal set successfully"}

@app.get("/daily-plan")
def get_daily_plan(user_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.ramadan_start_date:
        raise HTTPException(status_code=404, detail="User not found or goal not set")
    
    daily_juz_required = user.ramadan_goal
    today = datetime.now().date()
    ramadan_start = user.ramadan_start_date.date()
    
    plan = []
    for day in range(1, 31):
        day_date = ramadan_start + timedelta(days=day-1)
        start_juz = ((day - 1) * daily_juz_required) % 30 + 1
        required_juz = [((start_juz + i - 1) % 30) + 1 for i in range(daily_juz_required)]
        
        completed = db.query(Progress).filter(
            Progress.user_id == user_id,
            Progress.day_number == day,
            Progress.completed == True
        ).all()
        completed_juz = [p.juz_number for p in completed if p.juz_number]
        
        plan.append({
            "day": day,
            "date": datetime.combine(day_date, datetime.min.time()),
            "required_juz": required_juz,
            "completed_juz": completed_juz,
            "is_today": day_date == today,
            "is_future": day_date > today
        })
    
    return plan

@app.post("/progress")
def update_progress(progress: ProgressUpdate, user_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    existing = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.day_number == progress.day_number
    )
    
    if progress.juz_number:
        existing = existing.filter(Progress.juz_number == progress.juz_number)
    if progress.surah_number:
        existing = existing.filter(Progress.surah_number == progress.surah_number)
    if progress.page_number:
        existing = existing.filter(Progress.page_number == progress.page_number)
    
    existing = existing.first()
    
    if existing:
        existing.completed = progress.completed
        existing.completed_at = datetime.utcnow() if progress.completed else None
    else:
        new_progress = Progress(
            user_id=user_id,
            juz_number=progress.juz_number,
            surah_number=progress.surah_number,
            page_number=progress.page_number,
            day_number=progress.day_number,
            completed=progress.completed,
            completed_at=datetime.utcnow() if progress.completed else None
        )
        db.add(new_progress)
    
    db.commit()
    return {"message": "Progress updated"}

@app.get("/stats")
def get_stats(user_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.ramadan_start_date:
        raise HTTPException(status_code=404, detail="User not found or goal not set")
    
    total_required_juz = 30 * user.ramadan_goal
    completed_count = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.completed == True
    ).count()
    
    today = datetime.now().date()
    ramadan_start = user.ramadan_start_date.date()
    days_passed = max(1, (today - ramadan_start).days + 1)
    days_remaining = max(0, 30 - days_passed)
    
    completion_percentage = (completed_count / total_required_juz) * 100 if total_required_juz > 0 else 0
    quran_completions = completed_count / 30
    
    today_required = user.ramadan_goal
    today_completed = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.day_number == days_passed,
        Progress.completed == True
    ).count()
    today_percentage = (today_completed / today_required) * 100 if today_required > 0 else 0
    
    return {
        "total_juz_required": total_required_juz,
        "completed_juz": completed_count,
        "remaining_juz": total_required_juz - completed_count,
        "days_remaining": days_remaining,
        "completion_percentage": round(completion_percentage, 1),
        "quran_completions": round(quran_completions, 2),
        "daily_target": user.ramadan_goal,
        "on_track": completed_count >= (days_passed * user.ramadan_goal),
        "today_percentage": round(today_percentage, 1),
        "today_completed": today_completed,
        "today_required": today_required
    }

@app.get("/quran/juz/{juz_number}")
async def get_juz(juz_number: int):
    if juz_number < 1 or juz_number > 30:
        raise HTTPException(status_code=400, detail="Juz number must be between 1 and 30")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"https://api.alquran.cloud/v1/juz/{juz_number}/ar.alafasy")
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch Qur'an data")

@app.get("/quran/surah/{surah_number}")
async def get_surah(surah_number: int):
    if surah_number < 1 or surah_number > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"https://api.alquran.cloud/v1/surah/{surah_number}")
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch Qur'an data")

@app.get("/quran/page/{page_number}")
async def get_page(page_number: int):
    if page_number < 1 or page_number > 604:
        raise HTTPException(status_code=400, detail="Page number must be between 1 and 604")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"https://api.alquran.cloud/v1/page/{page_number}/ar.alafasy")
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch Qur'an data")

@app.get("/motivation")
def get_motivation():
    import random
    return {"message": random.choice(MOTIVATIONAL_MESSAGES)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)