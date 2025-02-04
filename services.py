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
async def trace_question(user_id: int, question_id: int) -> Dict:
    conn = await get_db_connection()
    await ensure_tables_exist()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT * FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}

        # Проверяем, существует ли вопрос
        question = await conn.fetchrow("SELECT * FROM questions WHERE question_id = $1;", question_id)
        if not question:
            return {"error": "Question not found"}

        # Проверяем, отслеживает ли пользователь этот вопрос
        trace = await conn.fetchrow(
            "SELECT * FROM question_traces WHERE question_id = $1 AND user_id = $2;",
            question_id, user_id
        )

        if trace:
            # Если вопрос уже отслеживается, удаляем запись
            await conn.execute(
                "DELETE FROM question_traces WHERE question_id = $1 AND user_id = $2;",
                question_id, user_id
            )
            return {"message": "Question untracked"}
        else:
            # Если вопрос не отслеживается, добавляем запись
            await conn.execute(
                """
                INSERT INTO question_traces (question_id, user_id, new_trace_question_comments)
                VALUES ($1, $2, FALSE);
                """,
                question_id, user_id
            )
            return {"message": "Question tracked"}
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
async def get_questions(user_id: int, all_questions: bool = True) -> List[Dict]:
    conn = await get_db_connection()
    await ensure_tables_exist()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("""
            SELECT liked_questions, reported_questions 
            FROM users WHERE user_id = $1;
        """, user_id)
        
        if not user:
            return {"error": "User not found"}
        
        # Декодируем JSON-поля пользователя
        liked_questions = json.loads(user["liked_questions"]) if user["liked_questions"] else []
        reported_questions = json.loads(user["reported_questions"]) if user["reported_questions"] else []

        # Получаем список вопросов, которые пользователь отслеживает
        trace_questions = await conn.fetch(
            """
            SELECT question_id FROM question_traces WHERE user_id = $1;
            """,
            user_id
        )
        trace_question_ids = [trace["question_id"] for trace in trace_questions]

        # Определяем запрос для выборки вопросов
        query = "WHERE q.user_id = $1" if not all_questions else ""

        # Получаем вопросы из базы данных с подсчетом комментариев и проверкой ответа пользователя
        questions = await conn.fetch(f"""
            SELECT 
                q.question_id,
                q.user_id,
                u.username,
                q.title,
                q.tags,
                q.likes,
                q.popular,
                (
                    SELECT COUNT(*) 
                    FROM comments c 
                    WHERE c.question_id = q.question_id
                ) AS comments_count,
                EXISTS (
                    SELECT 1 
                    FROM comments c 
                    WHERE c.question_id = q.question_id AND c.user_id = ${2 if not all_questions else 1}::BIGINT
                ) AS answered
            FROM questions q
            LEFT JOIN users u ON q.user_id = u.user_id
            {query};
        """, *(user_id,) if not all_questions else (user_id,))

        # Формируем список вопросов
        result = []
        for question in questions:
            questions_tags = json.loads(question["tags"]) if question["tags"] else []
            result.append({
                "question_id": question["question_id"],
                "user_id": question["user_id"],
                "user_name": question.get("username", "Unknown"),
                "title": question["title"],
                "likeCount": question["likes"],  # Заменили на 'likes'
                "popular": question["popular"],
                "tags": questions_tags,
                "report": question["question_id"] in reported_questions,
                "trace": question["question_id"] in trace_question_ids,  # Проверяем в списке отслеживаемых
                "like": question["question_id"] in liked_questions,
                "commentsCount": question["comments_count"],  # Количество комментариев
                "answered": question["answered"]  # Метка, указывающая, дал ли пользователь ответ
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
        
        # Проверяем, существует ли вопрос и получаем его заголовок
        question = await conn.fetchrow("SELECT title FROM questions WHERE question_id = $1;", question_id)
        if not question:
            return {"error": "Question not found"}
        
        question_title = question["title"]

        # Создаем комментарий
        query = """
        INSERT INTO comments (user_id, question_id, text) 
        VALUES ($1, $2, $3) RETURNING comment_id;
        """
        comment_id = await conn.fetchval(query, user_id, question_id, text)

        # Ограничиваем заголовок вопроса до 10 символов с добавлением многоточия
        short_title = (question_title[:10] + "...") if len(question_title) > 10 else question_title

        # Массовая вставка уведомлений и обновление меток new_trace_question_comments
        await conn.execute("""
            WITH updated_traces AS (
                UPDATE question_traces
                SET new_trace_question_comments = TRUE
                WHERE question_id = $1 AND new_trace_question_comments = FALSE
                RETURNING user_id
            )
            INSERT INTO notifications (user_id, title, description, type, is_read, question_id)
            SELECT 
                ut.user_id,
                'New Answer',
                'A new answer has been added to your tracked question: ' || $2,
                'trace',
                FALSE,
                $1
            FROM updated_traces ut;
        """, question_id, short_title)

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
"""Like a comments by user."""

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
"""Dislike a comment by user"""

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
"""Fetch Comments Data for QuestionId"""

# Fetch Tasks Data and add tasks
async def get_user_tasks(user_id: int) -> Dict:
    conn = await get_db_connection()
    await ensure_tables_exist()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT * FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}

        # Получаем все задачи пользователя
        tasks = await conn.fetch("SELECT * FROM tasks WHERE user_id = $1;", user_id)

        # Список всех возможных задач
        default_tasks = [
            {"title": "Subscribe our discord channel.", "cost": 1000},
            {"title": "Subscribe our telegram channel.", "cost": 100},
            {"title": "Post your first public question.", "cost": 300},
            {"title": "Post your first private question.", "cost": 400},
            {"title": "Answer your first public question.", "cost": 400}
        ]

        # Создаем словарь существующих задач для удобства проверки
        existing_tasks = {task["title"]: task for task in tasks}

        # Формируем полный список задач с учетом отсутствующих
        complete_tasks = []
        for idx, default_task in enumerate(default_tasks):
            if default_task["title"] in existing_tasks:
                task = existing_tasks[default_task["title"]]
                complete_tasks.append({
                    "key": task["task_id"],
                    "title": task["title"],
                    "isClaimed": task["is_claimed"],
                    "isDone": task["is_done"],
                    "cost": task["cost"]
                })
            else:
                # Добавляем отсутствующую задачу в базу данных
                await conn.execute("""
                    INSERT INTO tasks (user_id, title, cost)
                    VALUES ($1, $2, $3);
                """, user_id, default_task["title"], default_task["cost"])
                # И добавляем её в результирующий список
                new_task = await conn.fetchrow("""
                    SELECT * FROM tasks WHERE user_id = $1 AND title = $2;
                """, user_id, default_task["title"])
                complete_tasks.append({
                    "key": new_task["task_id"],
                    "title": new_task["title"],
                    "isClaimed": new_task["is_claimed"],
                    "isDone": new_task["is_done"],
                    "cost": new_task["cost"]
                })

        return {"tasks": complete_tasks}
    finally:
        await conn.close()
"""Fetch Tasks Data and add tasks"""

# Service for update Tasks Status
async def update_task_status(user_id: int, task_id: int, status: str) -> Dict:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchrow("SELECT * FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}

        # Проверяем, существует ли задача для данного пользователя
        task = await conn.fetchrow("SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2;", task_id, user_id)
        if not task:
            return {"error": "Task not found for this user"}

        # Логика обновления статуса задачи
        if status == 'done':
            # Устанавливаем задачу как выполненную
            await conn.execute("""
                UPDATE tasks SET is_done = TRUE WHERE task_id = $1;
            """, task_id)
            return {"message": "Task marked as done successfully"}

        elif status == 'claimed':
            # Проверяем, что задача уже выполнена
            if not task["is_done"]:
                return {"error": "Cannot claim a task that is not marked as done"}

            # Проверяем, что задача еще не была получена (claimed)
            if task["is_claimed"]:
                return {"error": "Task already claimed"}

            # Устанавливаем задачу как полученную и увеличиваем баланс пользователя
            cost = task["cost"]
            await conn.execute("""
                UPDATE tasks SET is_claimed = TRUE WHERE task_id = $1;
            """, task_id)

            # Увеличиваем баланс пользователя
            await conn.execute("""
                UPDATE users SET balance = balance + $1 WHERE user_id = $2;
            """, cost, user_id)

            return {"message": f"Task claimed successfully. Balance increased by {cost}"}

        else:
            return {"error": "Invalid status"}

    finally:
        await conn.close()
"""Service for update Tasks Status"""

# Fetch Notifications Data
async def get_notifications(user_id: int, unread_only: bool = True) -> List[Dict]:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchval("SELECT user_id FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}

        # Определяем запрос для выборки уведомлений
        query = """
        SELECT 
            notification_id, 
            title, 
            description, 
            type, 
            is_read, 
            to_char(created_at, 'YYYY.MM.DD HH24:MI') AS formatted_date
        FROM notifications
        WHERE user_id = $1
        """
        if unread_only:
            query += " AND is_read = FALSE"

        # Получаем уведомления из базы данных
        notifications = await conn.fetch(query, user_id)

        # Формируем список уведомлений
        result = []
        for notification in notifications:
            result.append({
                "id": notification["notification_id"],
                "title": notification["title"],
                "description": notification["description"],
                "type": notification["type"],
                "isRead": notification["is_read"],
                "animation": False,  # Поле animation всегда false при получении
                "createdAt": notification["formatted_date"]  # Используем отформатированную дату
            })

        return result
    finally:
        await conn.close()
"""Fetch Notifications Data"""

# Service for marked notifications is Read
async def mark_notifications_as_read(user_id: int, notification_ids: List[int]) -> Dict:
    conn = await get_db_connection()
    try:
        # Проверяем, существует ли пользователь
        user = await conn.fetchval("SELECT user_id FROM users WHERE user_id = $1;", user_id)
        if not user:
            return {"error": "User not found"}

        # Получаем question_id для каждого уведомления
        notifications = await conn.fetch(
            """
            SELECT question_id FROM notifications
            WHERE notification_id = ANY($1) AND user_id = $2;
            """,
            notification_ids, user_id
        )

        # Обновляем статус уведомлений на "прочитано"
        await conn.execute(
            """
            UPDATE notifications
            SET is_read = TRUE
            WHERE notification_id = ANY($1) AND user_id = $2;
            """,
            notification_ids, user_id
        )

        # Собираем уникальные question_id для обновления метки new_trace_question_comments
        question_ids = {n["question_id"] for n in notifications if n["question_id"]}

        # Обновляем метку new_trace_question_comments для всех найденных вопросов
        if question_ids:
            await conn.execute(
                """
                UPDATE question_traces
                SET new_trace_question_comments = FALSE
                WHERE question_id = ANY($1) AND user_id = $2;
                """,
                list(question_ids), user_id
            )

        return {"message": "Notifications marked as read"}
    finally:
        await conn.close()
"""Service for marked notifications is Read"""