import sqlite3
import pymysql
from datetime import datetime

# Connect to SQLite
sqlite_conn = sqlite3.connect('quran_app.db')
sqlite_cursor = sqlite_conn.cursor()

# Connect to MySQL
mysql_conn = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='quran_app'
)
mysql_cursor = mysql_conn.cursor()

# Migrate users
sqlite_cursor.execute('SELECT * FROM users')
users = sqlite_cursor.fetchall()

for user in users:
    mysql_cursor.execute(
        "INSERT INTO users (id, email, password, name, ramadan_goal, ramadan_start_date, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        user
    )

# Migrate progress
sqlite_cursor.execute('SELECT * FROM progress')
progress = sqlite_cursor.fetchall()

for p in progress:
    mysql_cursor.execute(
        "INSERT INTO progress (id, user_id, juz_number, surah_number, page_number, day_number, completed, completed_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
        p
    )

mysql_conn.commit()
print(f"Migrated {len(users)} users and {len(progress)} progress records")

sqlite_conn.close()
mysql_conn.close()
