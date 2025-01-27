import json
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from database import ensure_tables_exist, get_db_connection
from typing import List, Optional, Dict


#Fetch user data from the database and format the registration date."""
async def get_user_data(user_id: int) -> Optional[Dict]:
    conn = await get_db_connection()
    try:
        query = """
        SELECT 
            user_id,
            full_name AS "fullName",
            username AS "userName",
            TO_CHAR(registration_date, 'YYYY.MM.DD') AS "registrationDate",
            tasks,
            achievements,
            notifications,
            balance,
            rating,
            questions_per_day AS "questionsPerDay"
        FROM users
        WHERE user_id = $1;
        """
        user = await conn.fetchrow(query, user_id)
        if user:
            # Преобразуем JSON-строки обратно в словари
            user = dict(user)
            user["tasks"] = json.loads(user["tasks"]) if user["tasks"] else []
            user["achievements"] = json.loads(user["achievements"]) if user["achievements"] else []
            user["notifications"] = json.loads(user["notifications"]) if user["notifications"] else []
            return user
    finally:
        await conn.close()
    return None
"""Fetch user data from the database and format the registration date."""

#Fetch Statistics Data for User"""
async def get_user_statistics(user_id: int) -> Dict:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchval("SELECT user_id FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}
        
        # Получаем количество лайков, вопросов и комментариев
        likes_query = """
        SELECT 
            COALESCE(SUM(likes), 0) 
        FROM (
            SELECT likes FROM questions WHERE user_id = $1
            UNION ALL
            SELECT likes FROM comments WHERE user_id = $1
        ) subquery;
        """
        likes_received = await conn.fetchval(likes_query, user_id)

        questions_count = await conn.fetchval("SELECT COUNT(*) FROM questions WHERE user_id = $1;", user_id)
        answers_count = await conn.fetchval("SELECT COUNT(*) FROM comments WHERE user_id = $1;", user_id)
        received_answers_count = await conn.fetchval("""
        SELECT COUNT(*) 
        FROM comments 
        WHERE question_id IN (SELECT question_id FROM questions WHERE user_id = $1);
        """, user_id)

        return {
            "likesReceived": likes_received,
            "questionsCount": questions_count,
            "answersCount": answers_count,
            "receivedAnswersCount": received_answers_count
        }
    finally:
        await conn.close()
"""Fetch Statistics Data for User"""

#Create a new question and update user's questionsPerDay counter."""
async def create_question(user_id: int, title: str, tags: list) -> Dict:
    conn = await get_db_connection()
    await ensure_tables_exist()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT user_id, questions_per_day FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}
        
        # Проверяем, доступно ли создание вопроса
        if user["questions_per_day"] <= 0:
            return {"error": "You have reached the limit of questions for today"}

        # Создаем вопрос
        query = """
        INSERT INTO questions (user_id, title, tags) 
        VALUES ($1, $2, $3) RETURNING question_id;
        """
        question_id = await conn.fetchval(query, user_id, title, json.dumps(tags))

        # Уменьшаем счетчик вопросов
        await conn.execute("""
        UPDATE users SET questions_per_day = questions_per_day - 1 WHERE user_id = $1;
        """, user_id)

        return {"message": "Question created successfully", "question_id": question_id}
    finally:
        await conn.close()
"""Create a new question and update user's questionsPerDay counter."""

#Like or dislike a question by user."""
async def like_question(user_id: int, question_id: str) -> Dict:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT liked_questions FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}
        
        # Проверяем, существует ли вопрос
        question = await conn.fetchrow("SELECT likes FROM questions WHERE question_id = $1;", question_id)
        if not question:
            return {"error": "Question not found"}
        
        liked_questions = json.loads(user["liked_questions"]) if user["liked_questions"] else []
        
        # Лайк/дизлайк логика
        if question_id not in liked_questions:
            liked_questions.append(question_id)
            new_likes = question["likes"] + 1
        else:
            liked_questions.remove(question_id)
            new_likes = question["likes"] - 1
        
        # Обновляем базу данных
        await conn.execute("""
            UPDATE users SET liked_questions = $1 WHERE user_id = $2;
        """, json.dumps(liked_questions), user_id)
        await conn.execute("""
            UPDATE questions SET likes = $1 WHERE question_id = $2;
        """, new_likes, question_id)
        
        return {"message": "Like status updated"}
    finally:
        await conn.close()
"""Like or dislike a question by user."""

#Track or untrack a question."""
async def trace_question(user_id: int, question_id: str) -> Dict:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT trace_questions FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}
        
        trace_questions = json.loads(user["trace_questions"]) if user["trace_questions"] else []
        
        # Добавляем или удаляем вопрос из отслеживаемых
        if question_id not in trace_questions:
            trace_questions.append(question_id)
        else:
            trace_questions.remove(question_id)
        
        # Обновляем базу данных
        await conn.execute("""
            UPDATE users SET trace_questions = $1 WHERE user_id = $2;
        """, json.dumps(trace_questions), user_id)
        
        return {"message": "Trace status updated"}
    finally:
        await conn.close()
"""Track or untrack a question."""

#Report or unreport a question."""
async def report_question(user_id: int, question_id: str) -> Dict:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT reported_questions FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}
        
        reported_questions = json.loads(user["reported_questions"]) if user["reported_questions"] else []
        
        # Добавляем или удаляем вопрос из списка репортов
        if question_id not in reported_questions:
            reported_questions.append(question_id)
        else:
            reported_questions.remove(question_id)
        
        # Обновляем базу данных
        await conn.execute("""
            UPDATE users SET reported_questions = $1 WHERE user_id = $2;
        """, json.dumps(reported_questions), user_id)
        
        return {"message": "Report status updated"}
    finally:
        await conn.close()
"""Report or unreport a question."""

#Fetch Questions Data or User Questions Data"""
async def get_questions(user_id: int, allQuestions: bool = True) -> List[Dict]:
    conn = await get_db_connection()

    try:
        # Получаем данные пользователя
        user = await conn.fetchrow("""
            SELECT liked_questions, reported_questions, trace_questions 
            FROM users WHERE user_id = $1;
        """, user_id)
        
        if not user:
            return {"error": "User not found"}
        
        liked_questions = json.loads(user["liked_questions"]) if user["liked_questions"] else []
        reported_questions = json.loads(user["reported_questions"]) if user["reported_questions"] else []
        trace_questions = json.loads(user["trace_questions"]) if user["trace_questions"] else []
        
        # Определяем запрос для выборки вопросов
        query = "" if allQuestions else "WHERE user_id = $1"
        
        # Получаем вопросы из базы данных
        questions = await conn.fetch(f"""
            SELECT q.question_id, q.user_id, u.username, q.title, q.likes, q.popular, q.tags 
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.user_id
            {query};
        """, *([user_id] if not allQuestions else []))  # Используем *для передачи параметров

        # Формируем список вопросов
        result = []
        for question in questions:
            result.append({
                "question_id": question["question_id"],
                "user_id": question["user_id"],
                "user_name": question.get("username", "Unknown"),
                "title": question["title"],
                "likeCount": question["likes"],  # Заменили на 'likes'
                "popular": question["popular"],
                "tags": question["tags"],
                "report": question["question_id"] in reported_questions,
                "trace": question["question_id"] in trace_questions,
                "like": question["question_id"] in liked_questions
            })

        return result
    finally:
        await conn.close()
"""Fetch Questions Data or User Questions Data"""

#Create a new comments"""
async def create_comment(user_id: int, question_id: int, text: str) -> Dict:
    conn = await get_db_connection()
    await ensure_tables_exist()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchval("SELECT user_id FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}

        # Проверяем, существует ли вопрос
        question = await conn.fetchval("SELECT question_id FROM questions WHERE question_id = $1;", question_id)
        if not question:
            return {"error": "Question not found"}

        # Создаем комментарий
        query = """
        INSERT INTO comments (user_id, question_id, text) 
        VALUES ($1, $2, $3) RETURNING comment_id;
        """
        comment_id = await conn.fetchval(query, user_id, question_id, text)

        return {"message": "Comment created successfully", "comment_id": comment_id}
    finally:
        await conn.close()
"""Create a new comments"""

#Like a comments by user."""
async def like_comment(user_id: int, comment_id: int) -> Dict:
    conn = await get_db_connection()
    
    try:
        # Получаем данные пользователя и комментария
        user = await conn.fetchrow("SELECT liked_comments, disliked_comments FROM users WHERE user_id = $1;", user_id)
        comment = await conn.fetchrow("SELECT likes, dislikes FROM comments WHERE comment_id = $1;", comment_id)

        if not user:
            return {"error": "User not found"}
        if not comment:
            return {"error": "Comment not found"}

        liked_comments = json.loads(user["liked_comments"]) if user["liked_comments"] else []
        disliked_comments = json.loads(user["disliked_comments"]) if user["disliked_comments"] else []

        # Извлекаем значения likes и dislikes из записи комментария
        likes = comment["likes"]
        dislikes = comment["dislikes"]

        # Лайк или отмена лайка
        if comment_id not in liked_comments:
            liked_comments.append(comment_id)
            likes += 1
            # Убираем дизлайк, если он есть
            if comment_id in disliked_comments:
                disliked_comments.remove(comment_id)
                dislikes -= 1
        else:
            liked_comments.remove(comment_id)
            likes -= 1

        # Обновляем данные в базе
        await conn.execute(""" 
            UPDATE users SET liked_comments = $1, disliked_comments = $2 WHERE user_id = $3;
        """, json.dumps(liked_comments), json.dumps(disliked_comments), user_id)
        await conn.execute(""" 
            UPDATE comments SET likes = $1, dislikes = $2 WHERE comment_id = $3;
        """, likes, dislikes, comment_id)

        return {"message": "Like status updated"}
    finally:
        await conn.close()

# Dislike a comment by user
async def dislike_comment(user_id: int, comment_id: int) -> Dict:
    conn = await get_db_connection()
    
    try:
        # Получаем данные пользователя и комментария
        user = await conn.fetchrow("SELECT liked_comments, disliked_comments FROM users WHERE user_id = $1;", user_id)
        comment = await conn.fetchrow("SELECT likes, dislikes FROM comments WHERE comment_id = $1;", comment_id)

        if not user:
            return {"error": "User not found"}
        if not comment:
            return {"error": "Comment not found"}

        liked_comments = json.loads(user["liked_comments"]) if user["liked_comments"] else []
        disliked_comments = json.loads(user["disliked_comments"]) if user["disliked_comments"] else []

        # Извлекаем значения likes и dislikes из записи комментария
        likes = comment["likes"]
        dislikes = comment["dislikes"]

        # Дизлайк или отмена дизлайка
        if comment_id not in disliked_comments:
            disliked_comments.append(comment_id)
            dislikes += 1
            # Убираем лайк, если он есть
            if comment_id in liked_comments:
                liked_comments.remove(comment_id)
                likes -= 1
        else:
            disliked_comments.remove(comment_id)
            dislikes -= 1

        # Обновляем данные в базе
        await conn.execute(""" 
            UPDATE users SET liked_comments = $1, disliked_comments = $2 WHERE user_id = $3;
        """, json.dumps(liked_comments), json.dumps(disliked_comments), user_id)
        await conn.execute(""" 
            UPDATE comments SET likes = $1, dislikes = $2 WHERE comment_id = $3;
        """, likes, dislikes, comment_id)

        return {"message": "Dislike status updated"}
    finally:
        await conn.close()

# Fetch Comments Data for QuestionId
async def get_comments(question_id: int, user_id: int) -> List[Dict]:
    conn = await get_db_connection()
    
    try:
        # Получаем данные пользователя
        user = await conn.fetchrow("""
            SELECT liked_comments, disliked_comments FROM users WHERE user_id = $1;
        """, user_id)
        if not user:
            return {"error": "User not found"}

        liked_comments = json.loads(user["liked_comments"]) if user["liked_comments"] else []
        disliked_comments = json.loads(user["disliked_comments"]) if user["disliked_comments"] else []

        # Получаем список комментариев для указанного вопроса
        comments = await conn.fetch("""
            SELECT comment_id, user_id, text, likes, dislikes 
            FROM comments WHERE question_id = $1;
        """, question_id)

        if not comments:
            return []

        # Формируем список комментариев с учетом пользовательских лайков/дизлайков
        result = []
        for comment in comments:
            result.append({
                "commentId": comment["comment_id"],
                "questionId": question_id,
                "user_id": comment["user_id"],
                "text": comment["text"],
                "likes": comment["likes"],
                "dislikes": comment["dislikes"],
                "likedByUser": comment["comment_id"] in liked_comments,
                "dislikedByUser": comment["comment_id"] in disliked_comments
            })

        return result
    finally:
        await conn.close()
