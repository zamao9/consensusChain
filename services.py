from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from database import db
from typing import List, Optional, Dict

COLLECTION_USERS = "users"

# Функция для преобразования данных MongoDB в JSON-совместимый формат
def mongo_obj_to_dict(obj):
    """Преобразование MongoDB объекта в Python словарь с заменой ObjectId на строку"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: mongo_obj_to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [mongo_obj_to_dict(v) for v in obj]
    else:
        return obj

#Fetch user data from the database and format the registration date."""
async def get_user_data(user_id: int) -> Optional[Dict]:
    users_collection = db.get_collection(COLLECTION_USERS)
    
    # Запрашиваем только нужные поля
    projection = {
        "_id": 0,                # Исключаем поле `_id`
        "user_id": 1,
        "fullName": 1,
        "userName": 1,
        "registrationDate": 1,
        "tasks": 1,
        "achievements": 1,
        "notifications": 1,
        "balance": 1,
        "rating": 1,
        "questionsPerDay": 1
    }

    user = await users_collection.find_one({"user_id": str(user_id)}, projection)

    if user:
        # Форматируем дату
        if "registrationDate" in user:
            original_date = user["registrationDate"]
            user["registrationDate"] = original_date.split("T")[0].replace("-", ".")

        return user

    return None
"""Fetch user data from the database and format the registration date."""

#Create a new question and update user's questionsPerDay counter."""
async def create_question(user_id: str, title: str, tags: list) -> Dict:
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")
    question_id = str(len(await questions_collection.find().to_list(None)) + 1)
    # Проверяем, существует ли пользователь в базе
    user = await users_collection.find_one({"user_id": user_id})
    
    if not user:
        return {"error": "User not found"}
    
    # Проверяем, есть ли поле questionsPerDay у пользователя, если нет - создаем
    if "questionsPerDay" not in user:
        user["questionsPerDay"] = 3  # Даем значение по умолчанию

    # Проверяем, есть ли еще доступные вопросы для создания
    if user["questionsPerDay"] <= 0:
        return {"error": "You have reached the limit of questions for today"}

    # Создаем новый вопрос
    question_data = {
        "user_id": user_id,
        "question_id":question_id,
        "user": user.get("userName", "Unknown"),
        "title": title,
        "tags": tags,
        "likeCount": 0,
        "popular": False  # Начальный статус вопроса
    }

    # Сохраняем вопрос в базе данных
    result = await questions_collection.insert_one(question_data)

    # Уменьшаем количество доступных вопросов для пользователя
    user["questionsPerDay"] -= 1
    await users_collection.update_one({"user_id": user_id}, {"$set": {"questionsPerDay": user["questionsPerDay"]}})

    return {"message": "Question created successfully", "question_id": str(result.inserted_id)}
"""Create a new question and update user's questionsPerDay counter."""

#Like or dislike a question by user."""
async def like_question(user_id: int, question_id: str) -> Dict:
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")

    user = await users_collection.find_one({"user_id": str(user_id)})
    question = await questions_collection.find_one({"question_id": question_id})

    if not user:
        return {"error": "User not found"}
    if not question:
        return {"error": "Question not found"}

    # Инициализация likedQuestions, если его нет в документе пользователя
    if "likedQuestions" not in user:
        user["likedQuestions"] = []

    # Лайк или дизлайк
    if question_id not in user.get("likedQuestions", []):
        user["likedQuestions"].append(question_id)
        question["likeCount"] += 1  # Увеличиваем счетчик лайков
    else:
        user["likedQuestions"].remove(question_id)
        question["likeCount"] -= 1  # Уменьшаем счетчик лайков

    # Обновляем данные в базе
    await users_collection.update_one({"user_id": str(user_id)}, {"$set": {"likedQuestions": user["likedQuestions"]}})
    await questions_collection.update_one({"question_id": question_id}, {"$set": {"likeCount": question["likeCount"]}})

    return {"message": "Like status updated"}
"""Like or dislike a question by user."""

#Track or untrack a question."""
async def trace_question(user_id: int, question_id: str) -> Dict:
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")

    user = await users_collection.find_one({"user_id": str(user_id)})
    question = await questions_collection.find_one({"question_id": question_id})

    if not user:
        return {"error": "User not found"}
    if not question:
        return {"error": "Question not found"}
    
    if "traceQuestions" not in user:
        user["traceQuestions"] = []

    # Добавляем или удаляем вопрос из списка отслеживаемых
    if question_id not in user.get("traceQuestions", []):
        user["traceQuestions"].append(question_id)
    else:
        user["traceQuestions"].remove(question_id)

    # Обновляем данные в базе
    await users_collection.update_one({"user_id": str(user_id)}, {"$set": {"traceQuestions": user["traceQuestions"]}})

    return {"message": "Trace status updated"}
"""Track or untrack a question."""

#Report or unreport a question."""
async def report_question(user_id: int, question_id: str) -> Dict:
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")

    user = await users_collection.find_one({"user_id": str(user_id)})
    question = await questions_collection.find_one({"question_id": question_id})

    if not user:
        return {"error": "User not found"}
    if not question:
        return {"error": "Question not found"}

    if "reportQuestions" not in user:
        user["reportQuestions"] = []

    # Добавляем или удаляем вопрос из списка репортнутых
    if question_id not in user.get("reportQuestions", []):
        user["reportQuestions"].append(question_id)
    else:
        user["reportQuestions"].remove(question_id)

    # Обновляем данные в базе
    await users_collection.update_one({"user_id": str(user_id)}, {"$set": {"reportQuestions": user["reportQuestions"]}})

    return {"message": "Report status updated"}
"""Report or unreport a question."""

#Fetch Questions Data or User Questions Data"""
async def get_questions(user_id: str, allQuestions: bool = True) -> List[Dict]:
    """
    Получает данные всех вопросов или только вопросов пользователя.

    Args:
        user_id (str): ID пользователя.
        allQuestions (bool): Если True, возвращает все вопросы, иначе только вопросы пользователя.

    Returns:
        List[Dict]: Список вопросов с дополнительной информацией о статусах (лайк, репорт, отслеживание).
    """
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")
    
    # Получаем данные пользователя
    user = await users_collection.find_one(
        {"user_id": user_id},
        {"_id": 0, "likedQuestions": 1, "reportedQuestions": 1, "traceQuestions": 1}
    )
    if not user:
        return {"error": "User not found"}
    
    liked_questions = user.get("likedQuestions", [])
    reported_questions = user.get("reportedQuestions", [])
    trace_questions = user.get("traceQuestions", [])
    
    # Определяем запрос для выборки вопросов
    query = {} if allQuestions else {"user_id": user_id}
    questions = await questions_collection.find(query).to_list(None)
    
    # Формируем список вопросов
    result = []
    for question in questions:
        result.append({
            "question_id": question["question_id"],
            "user_id": question["user_id"],
            "user_name": question.get("user", "Unknown"),
            "title": question["title"],
            "likeCount": question.get("likeCount", 0),
            "popular": question.get("popular", False),
            "tags": question.get("tags", []),
            "report": question["question_id"] in reported_questions,
            "trace": question["question_id"] in trace_questions,
            "like": question["question_id"] in liked_questions
        })
    
    return result
"""Fetch Questions Data or User Questions Data"""

#Create a new comments"""
async def create_comment(user_id: str, question_id: str, text: str) -> Dict:
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")
    comments_collection = db.get_collection("comments")

    # Проверяем, существует ли пользователь
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        return {"error": "User not found"}

    # Проверяем, существует ли вопрос
    question = await questions_collection.find_one({"question_id": question_id})
    if not question:
        return {"error": "Question not found"}

    # Генерация ID комментария
    comments_id = str(len(await comments_collection.find().to_list(None)) + 1)

    # Создаем комментарий
    comment_data = {
        "comments_id": comments_id,
        "question_id": question_id,
        "user_id": user_id,
        "text": text,
        "likes": 0,
        "dislikes": 0
    }
    await comments_collection.insert_one(comment_data)

    return {"message": "Comment created successfully", "comments_id": comments_id}
"""Create a new comments"""

#Like a comments by user."""
async def like_comment(user_id: str, comment_id: str) -> Dict:
    users_collection = db.get_collection("users")
    comments_collection = db.get_collection("comments")

    user = await users_collection.find_one({"user_id": user_id})
    comment = await comments_collection.find_one({"comments_id": comment_id})

    if not user:
        return {"error": "User not found"}
    if not comment:
        return {"error": "Comment not found"}

    # Инициализация likedComments, если его нет в документе пользователя
    if "likedComments" not in user:
        user["likedComments"] = []

    # Лайк или отмена лайка
    if comment_id not in user["likedComments"]:
        user["likedComments"].append(comment_id)
        comment["likes"] += 1
        # Убираем дизлайк, если он есть
        if comment_id in user.get("dislikedComments", []):
            user["dislikedComments"].remove(comment_id)
            comment["dislikes"] -= 1
    else:
        user["likedComments"].remove(comment_id)
        comment["likes"] -= 1

    # Обновляем данные в базе
    await users_collection.update_one({"user_id": user_id}, {"$set": {"likedComments": user["likedComments"], "dislikedComments": user.get("dislikedComments", [])}})
    await comments_collection.update_one({"comments_id": comment_id}, {"$set": {"likes": comment["likes"], "dislikes": comment["dislikes"]}})

    return {"message": "Like status updated"}
"""Like or dislike a comments by user."""

#Dislike a comments by user."""
async def dislike_comment(user_id: str, comment_id: str) -> Dict:
    users_collection = db.get_collection("users")
    comments_collection = db.get_collection("comments")

    user = await users_collection.find_one({"user_id": user_id})
    comment = await comments_collection.find_one({"comments_id": comment_id})

    if not user:
        return {"error": "User not found"}
    if not comment:
        return {"error": "Comment not found"}

    # Инициализация dislikedComments, если его нет в документе пользователя
    if "dislikedComments" not in user:
        user["dislikedComments"] = []

    # Дизлайк или отмена дизлайка
    if comment_id not in user["dislikedComments"]:
        user["dislikedComments"].append(comment_id)
        comment["dislikes"] += 1
        # Убираем лайк, если он есть
        if comment_id in user.get("likedComments", []):
            user["likedComments"].remove(comment_id)
            comment["likes"] -= 1
    else:
        user["dislikedComments"].remove(comment_id)
        comment["dislikes"] -= 1

    # Обновляем данные в базе
    await users_collection.update_one({"user_id": user_id}, {"$set": {"dislikedComments": user["dislikedComments"], "likedComments": user.get("likedComments", [])}})
    await comments_collection.update_one({"comments_id": comment_id}, {"$set": {"likes": comment["likes"], "dislikes": comment["dislikes"]}})

    return {"message": "Dislike status updated"}
"""Dislike a comments by user."""

#Fetch Comments Data for QuestionId"""
async def get_comments(question_id: str, user_id: str) -> List[Dict]:
    users_collection = db.get_collection("users")
    comments_collection = db.get_collection("comments")

    # Получаем данные пользователя
    user = await users_collection.find_one({"user_id": user_id}, {"_id": 0, "likedComments": 1, "dislikedComments": 1})
    if not user:
        return {"error": "User not found"}

    liked_comments = user.get("likedComments", [])
    disliked_comments = user.get("dislikedComments", [])

    # Получаем список комментариев для указанного вопроса
    comments = await comments_collection.find({"question_id": question_id}).to_list(None)
    if not comments:
        return []

    # Формируем список комментариев с учетом пользовательских лайков/дизлайков
    result = []
    for comment in comments:
        result.append({
            "commentsId": comment["comments_id"],
            "questionId": comment["question_id"],
            "user_id": comment["user_id"],
            "text": comment["text"],
            "likes": comment.get("likes", 0),
            "dislikes": comment.get("dislikes", 0),
            "likedByUser": comment["comments_id"] in liked_comments,
            "dislikedByUser": comment["comments_id"] in disliked_comments
        })

    return result
"""Fetch Comments Data for QuestionId"""

#Fetch Statistics Data for User"""
async def get_user_statistics(user_id: str) -> Dict:
    # Получаем данные пользователя
    users_collection = db.get_collection("users")
    questions_collection = db.get_collection("questions")
    comments_collection = db.get_collection("comments")

    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        return {"error": "User not found"}

    # Подсчитаем количество лайков
    questions = await questions_collection.find({"user_id": user_id}).to_list(None)
    comments = await comments_collection.find({"user_id": user_id}).to_list(None)

    likes_received = 0
    for question in questions:
        likes_received += question.get("likes", 0)
    for comment in comments:
        likes_received += comment.get("likes", 0)

    # Подсчитаем количество созданных вопросов
    questions_count = len(questions)

    # Подсчитаем количество данных ответов
    answers_count = len(comments)

    # Подсчитаем количество полученных ответов на вопросы пользователя
    received_answers_count = 0
    for question in questions:
        received_answers_count += await comments_collection.count_documents({"question_id": question["question_id"]})

    return {
        "likesReceived": likes_received,
        "questionsCount": questions_count,
        "answersCount": answers_count,
        "receivedAnswersCount": received_answers_count
    }
"""Fetch Statistics Data for User"""