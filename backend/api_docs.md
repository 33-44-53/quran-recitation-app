# API Documentation

## Base URL
`http://localhost:8000`

## Endpoints

### Users

#### POST /users/
Create a new user with Ramadan goal
```json
{
  "email": "user@example.com", // optional
  "ramadan_goal": 3,
  "ramadan_start_date": "2024-03-11T00:00:00Z"
}
```

#### GET /users/{user_id}
Get user details
```json
{
  "id": 1,
  "email": "user@example.com",
  "ramadan_goal": 3,
  "ramadan_start_date": "2024-03-11T00:00:00Z"
}
```

### Progress Tracking

#### GET /users/{user_id}/daily-plan
Get 30-day reading plan
```json
[
  {
    "day": 1,
    "date": "2024-03-11T00:00:00Z",
    "required_juz": [1, 2, 3],
    "completed_juz": [1, 2],
    "is_today": true,
    "is_future": false
  }
]
```

#### POST /users/{user_id}/progress
Update Juz completion status
```json
{
  "juz_number": 1,
  "day_number": 1,
  "completed": true
}
```

#### GET /users/{user_id}/stats
Get user statistics
```json
{
  "total_juz_required": 90,
  "completed_juz": 15,
  "remaining_juz": 75,
  "days_remaining": 25,
  "completion_percentage": 16.7,
  "quran_completions": 0.5,
  "daily_target": 3,
  "on_track": true
}
```

### Quran Content

#### GET /quran/juz/{juz_number}
Get Juz content from AlQuran API
```json
{
  "data": {
    "ayahs": [
      {
        "number": 1,
        "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "surah": {
          "number": 1,
          "name": "الفاتحة",
          "englishName": "Al-Fatihah"
        }
      }
    ]
  }
}
```

### Motivation

#### GET /motivation
Get random motivational message
```json
{
  "message": "The Qur'an is a healing for what is in the hearts. - Quran 17:82"
}
```