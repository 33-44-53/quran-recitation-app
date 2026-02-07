import psycopg

# PostgreSQL connection (Neon)
neon_url = "postgresql://neondb_owner:npg_jQehWAIi9Cw8@ep-summer-band-aii7qqo7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
pg_conn = psycopg.connect(neon_url)
pg_cursor = pg_conn.cursor()

# Fix the sequence to start after existing users
pg_cursor.execute("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
pg_cursor.execute("SELECT setval('progress_id_seq', (SELECT MAX(id) FROM progress))")

pg_conn.commit()
print("Sequences fixed! New users can now sign up.")

pg_conn.close()
