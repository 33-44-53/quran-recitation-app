# Database Schema

## Tables

### users
- `id` (INTEGER, PRIMARY KEY)
- `email` (STRING, UNIQUE, NULLABLE)
- `ramadan_goal` (INTEGER, DEFAULT 1) - Number of Quran completions (1-10)
- `ramadan_start_date` (DATETIME) - When user started their Ramadan journey
- `created_at` (DATETIME, DEFAULT NOW)

### progress
- `id` (INTEGER, PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `juz_number` (INTEGER) - Juz number (1-30)
- `day_number` (INTEGER) - Day of Ramadan (1-30)
- `completed` (BOOLEAN, DEFAULT FALSE)
- `completed_at` (DATETIME, NULLABLE)

## Goal Calculation Logic

### Daily Target Calculation
```
daily_juz_required = user.ramadan_goal
```

### Juz Assignment per Day
```
For day N (1-30):
  start_juz = ((N - 1) * daily_juz_required) % 30 + 1
  required_juz = [start_juz, start_juz+1, ..., start_juz+daily_juz_required-1]
  (with wraparound for Juz > 30)
```

### Examples
- **1x completion**: Day 1 = Juz 1, Day 2 = Juz 2, etc.
- **2x completion**: Day 1 = Juz 1,2, Day 2 = Juz 3,4, etc.
- **3x completion**: Day 1 = Juz 1,2,3, Day 2 = Juz 4,5,6, etc.

### Progress Tracking
- Each Juz completion is tracked per day
- Overall progress = (completed_juz_count / total_required_juz) * 100
- Quran completions = completed_juz_count / 30