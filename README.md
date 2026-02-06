# Tilawa - Your Journey Through the Quran 🌙

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-Python-white?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
</p>

<p align="center">
  <strong>A full-stack Islamic web application designed to help Muslims complete the Quran during Ramadan with personalized reading goals and progress tracking.</strong>
</p>

---

## 🕌 About Tilawa

**Tilawa** (تِلاْوَة) means "Recitation" in Arabic - a web application that helps Muslims track their Quran reading journey. Built with modern web technologies, it provides a seamless experience for setting Ramadan goals, tracking daily progress, and deepening one's connection with the Holy Quran.

This project was developed by **Umer Software** with the vision of making Quran reading more accessible and trackable for Muslims worldwide.

---

## ✨ Key Features

### 🔐 Authentication System
- Secure Sign Up and Login with email and password
- JWT (JSON Web Token) based authentication
- Password hashing with bcrypt for security
- Persistent login sessions

### 🎯 Goal Setting
- Choose from 1x, 2x, 3x, or 5x Quran completion goals
- Automatic calculation: 3x = 3 Juz/day = Complete every 10 days
- Visual goal display with completion timeline
- Customizable start dates

### 📊 Progress Tracking
- **Today's Progress**: Real-time percentage showing completion status
- **Overall Progress**: Track total Quran completions
- **Quran Completions Counter**: See how many full readings you've completed
- **Days Remaining**: Countdown to the end of Ramadan
- **Color-coded Calendar**: 30-day visual representation of your progress

### 📖 Quran Reading Interface
- **3 Reading Modes**:
  - 📖 By Juz (1-30)
  - 📖 By Surah (All 114 Surahs)
  - 📖 By Page (1-604)
- Large, clear Arabic typography using KFGQPC Uthmanic Script HAFS font
- Smooth navigation with next/previous buttons
- Verse numbers displayed in traditional format (﴿1﴾)

### 📱 Dashboard Features
- Personalized greeting with user name
- Today's required Juz list
- Quick "Read" buttons for each section
- Islamic motivational quotes
- Real-time statistics updates

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with server components |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | FastAPI (Python) | High-performance REST API |
| **Database** | SQLite (Dev) / PostgreSQL (Prod) | Data persistence |
| **Authentication** | JWT + bcrypt | Secure authentication |
| **Quran API** | AlQuran Cloud API | Authentic Quran content |
| **Icons** | Lucide React | Beautiful, consistent icon set |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/tilawa.git
cd tilawa
```

**2. Set up the Backend:**
```bash
cd quran-app/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
- Backend runs at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

**3. Set up the Frontend:**
```bash
cd quran-app/frontend
npm install
npm run dev
```
- Frontend runs at: `http://localhost:3000`

---

## 📱 User Flow

```
┌─────────────┐
│  Sign Up /  │
│    Login    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Set Your   │
│   Goal       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Dashboard │
│   (See your │
│  daily plan)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Read the  │
│    Quran    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Track    │
│  Progress   │
└─────────────┘
```

---

## 📊 Goal Calculation Examples

| Goal | Daily Juz | Days per Completion | Total Juz (30 days) |
|------|-----------|---------------------|---------------------|
| 1x   | 1 Juz     | 30 days             | 30 Juz              |
| 2x   | 2 Juz     | 15 days             | 60 Juz              |
| 3x   | 3 Juz     | 10 days             | 90 Juz (3x complete)|
| 5x   | 5 Juz     | 6 days              | 150 Juz (5x complete)|

---

## 🎨 Design Features

- **Islamic Green Theme**: Authentic color palette inspired by Islamic art
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Arabic Typography**: Large, clear Arabic fonts for comfortable reading
- **Dark Mode Support**: Easy on the eyes during nighttime reading
- **Smooth Animations**: Polished transitions and hover effects

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create new account |
| POST | `/login` | Login and get JWT token |
| GET | `/me` | Get current user info |

### Goals & Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/set-goal` | Set Ramadan goal |
| GET | `/daily-plan` | Get 30-day plan |
| POST | `/progress` | Mark Juz as read |
| GET | `/stats` | Get statistics |

### Quran Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quran/juz/{1-30}` | Get Juz content |
| GET | `/quran/surah/{1-114}` | Get Surah content |
| GET | `/quran/page/{1-604}` | Get Page content |

---

## 📁 Project Structure

```
tilawa/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── ...
├── frontend/
│   ├── app/
│   │   ├── components/     # React components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GoalSelection.tsx
│   │   │   ├── FreeReading.tsx
│   │   │   └── QuranReader.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── public/
│   │   ├── icon.svg
│   │   ├── bg.jpg
│   │   └── bg2.jpg
│   ├── package.json
│   ├── tailwind.config.js
│   └── ...
├── README.md
├── FEATURES.md
├── SETUP.md
└── database/
    └── schema.md
```

---

## 🌟 Success Stories

Tilawa helps users:
- ✅ Set realistic and achievable Quran reading goals
- ✅ Track daily progress with clear percentages
- ✅ Stay motivated through visual progress indicators
- ✅ Complete multiple Qurans during Ramadan
- ✅ Read comfortably with optimized typography
- ✅ Access any Surah or page instantly

---

## 🤝 Connect With Me

<p align="center">
  <a href="https://t.me/umem2034">
    <img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram" alt="Telegram" />
  </a>
  <a href="https://instagram.com/umer.salahadin">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram" alt="Instagram" />
  </a>
  <a href="https://www.linkedin.com/in/umer-selahadin-77b83b318/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
  </a>
</p>

---

## 🙏 Acknowledgments

- **AlQuran Cloud API** for providing authentic Quran content
- **KFGQPC** for the beautiful Uthmanic Script HAFS font
- **Lucide** for the icon set
- **Open Source Community** for continuous inspiration

---

## 📜 License

This project is open source and available under the MIT License.

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://www.linkedin.com/in/umer-selahadin-77b83b318/">Umer Software</a></sub>
</p>

<p align="center">
  <sub>May Allah accept your recitation and make this Ramadan blessed! 🌙</sub>
</p>

---

## 📣 Share Your Experience

If you're using Tilawa, I'd love to hear about your experience! Feel free to connect with me on social media and share how the app is helping you in your Quran reading journey.

**#Tilawa #QuranReading #Ramadan #IslamicTech #WebDevelopment #NextJS #FastAPI**
