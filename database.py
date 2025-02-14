import asyncpg
# Настройки PostgreSQL
DATABASE_URL = "postgresql://postgres:lUvaDDNjFgjUXEVJGArTQTUzfEoUrxqc@roundhouse.proxy.rlwy.net:15873/railway"

# Подключение к PostgreSQL
async def get_db_connection():
    return await asyncpg.connect(DATABASE_URL)

async def ensure_tables_exist():
    conn = await get_db_connection()
    try:
        # Создаем таблицы, если их нет
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id BIGINT PRIMARY KEY,
            full_name TEXT,
            username TEXT,
            registration_date DATE DEFAULT CURRENT_DATE,
            tasks JSONB DEFAULT '[]',
            achievements JSONB DEFAULT '[]',
            notifications JSONB DEFAULT '[]',
            balance NUMERIC DEFAULT 0,
            rating INT DEFAULT 0,
            questions_per_day INT DEFAULT 3
        );
        """)
        await conn.execute("""
        ALTER TABLE questions ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';
        UPDATE questions SET language = 'English' WHERE language IS NULL;
        """)        
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            question_id SERIAL PRIMARY KEY,
            user_id BIGINT REFERENCES users(user_id),
            title TEXT NOT NULL,
            tags JSONB DEFAULT '[]',
            likes INT DEFAULT 0,
            popular BOOLEAN DEFAULT FALSE,
            language TEXT DEFAULT 'English'
        );
        """)
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            comment_id SERIAL PRIMARY KEY,
            question_id INT REFERENCES questions(question_id),
            user_id BIGINT REFERENCES users(user_id),
            text TEXT NOT NULL,
            likes INT DEFAULT 0,
            dislikes INT DEFAULT 0
        );
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                task_id SERIAL PRIMARY KEY,
                user_id BIGINT REFERENCES users(user_id),
                title TEXT NOT NULL,
                is_claimed BOOLEAN DEFAULT FALSE,
                is_done BOOLEAN DEFAULT FALSE,
                cost NUMERIC DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS question_traces (
                trace_id SERIAL PRIMARY KEY,
                question_id INT REFERENCES questions(question_id),
                user_id BIGINT REFERENCES users(user_id),
                new_trace_question_comments BOOLEAN DEFAULT FALSE,
                UNIQUE (question_id, user_id) -- Каждый пользователь может отслеживать вопрос только один раз
            );
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id SERIAL PRIMARY KEY,
                user_id BIGINT REFERENCES users(user_id),
                question_id INT REFERENCES questions(question_id), -- Новое поле
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                type TEXT NOT NULL, -- 'updates', 'messages', 'trace', 'likes'
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
    finally:
        await conn.close()
