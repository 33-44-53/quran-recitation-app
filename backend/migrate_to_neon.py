import pymysql
import psycopg

# MySQL connection (local XAMPP)
mysql_conn = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    database='quran_app'
)
mysql_cursor = mysql_conn.cursor()

# PostgreSQL connection (Neon)
neon_url = "postgresql://neondb_owner:npg_jQehWAIi9Cw8@ep-summer-band-aii7qqo7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
pg_conn = psycopg.connect(neon_url)
pg_cursor = pg_conn.cursor()

# Create tables in PostgreSQL
pg_cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    ramadan_goal INTEGER DEFAULT 1,
    ramadan_start_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

pg_cursor.execute("""
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    juz_number INTEGER,
    surah_number INTEGER,
    page_number INTEGER,
    day_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
)
""")

pg_conn.commit()

# Migrate users
mysql_cursor.execute('SELECT id, email, password, name, ramadan_goal, ramadan_start_date, created_at FROM users')
users = mysql_cursor.fetchall()

for user in users:
    try:
        pg_cursor.execute(
            "INSERT INTO users (id, email, password, name, ramadan_goal, ramadan_start_date, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            user
        )
        print(f"Migrated user: {user[1]}")
    except Exception as e:
        print(f"Error migrating user {user[1]}: {e}")

# Migrate progress
mysql_cursor.execute('SELECT id, user_id, juz_number, surah_number, page_number, day_number, completed, completed_at FROM progress')
progress = mysql_cursor.fetchall()

for p in progress:
    try:
        # Convert boolean from MySQL (0/1) to PostgreSQL (True/False)
        p_list = list(p)
        p_list[6] = bool(p_list[6])  # completed field
        pg_cursor.execute(
            "INSERT INTO progress (id, user_id, juz_number, surah_number, page_number, day_number, completed, completed_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            tuple(p_list)
        )
    except Exception as e:
        print(f"Error migrating progress: {e}")

pg_conn.commit()
print(f"\nMigration complete! Migrated {len(users)} users and {len(progress)} progress records")

mysql_conn.close()
pg_conn.close()
