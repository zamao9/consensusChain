import os
from typing import Dict, List
from fastapi import FastAPI, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from models import CommentRequest, GetCommentsRequest, LikeDislikeRequest, Question, UserStatistics
from services import create_comment, create_question, dislike_comment, get_comments, get_notifications, get_questions, get_user_data, get_user_statistics, get_user_tasks, like_comment, like_question, mark_notifications_as_read, report_question, trace_question, update_task_status



@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        yield
    finally:
        yield

# Initialize FastAPI with lifespan
app = FastAPI(lifespan=lifespan)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Получить информацию о пользователе по user_id
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user_data = await get_user_data(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

# Создать новый вопрос
@app.post("/questions/")
async def create_new_question(request: Question):
    user_id = int(request.user_id)
    title = request.title
    tags = request.tags
    language = request.language
    return await create_question(user_id, title, tags, language)

# Лайк/дизлайк вопроса пользователем
@app.post("/questions/{question_id}/like")
async def like_or_dislike_question(question_id: str, request: LikeDislikeRequest):
    user_id = int(request.user_id)
    question_id=int(question_id)
    return await like_question(user_id, question_id)

# Добавить или убрать вопрос из наблюдаемых
@app.post("/questions/{question_id}/trace")
async def trace_or_untrace_question(question_id: str, request: LikeDislikeRequest):
    user_id = int(request.user_id)
    question_id=int(question_id)
    return await trace_question(user_id, question_id)

# Пожаловаться на вопрос
@app.post("/questions/{question_id}/report")
async def report_or_unreport_question(question_id: str, request: LikeDislikeRequest):
    question_id=int(question_id)
    user_id = int(request.user_id)
    return await report_question(user_id, question_id)

# Получить все вопросы пользователя
@app.get("/questions/{user_id}")
async def fetch_questions(user_id: str, allQuestions: bool = True):
    user_id = int(user_id)
    response = await get_questions(user_id, allQuestions)
    if isinstance(response, dict) and "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

#Добавить коммент
@app.post("/questions/{question_id}/comments")
async def add_comment(question_id: str, request: CommentRequest):
    user_id = int(request.user_id)
    question_id=int(question_id)
    text = request.text
    response = await create_comment(user_id, question_id, text)
    if "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

# Лайкнуть комментарий
@app.post("/comments/{comment_id}/like")
async def like_comment_endpoint(comment_id: str, request: LikeDislikeRequest):
    user_id = int(request.user_id)
    comment_id=int(comment_id)
    response = await like_comment(user_id, comment_id)
    if "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

# Дизлайкнуть комментарий
@app.post("/comments/{comment_id}/dislike")
async def dislike_comment_endpoint(comment_id: str, request: LikeDislikeRequest):
    user_id = int(request.user_id)
    comment_id=int(comment_id)
    response = await dislike_comment(user_id, comment_id)
    if "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

# Получить комментарии к вопросу
@app.get("/questions/{question_id}/comments")
async def get_comments_endpoint(question_id: str, user_id: str):
    user_id = int(user_id)
    question_id=int(question_id)
    comments = await get_comments(question_id, user_id)
    if "error" in comments:
        raise HTTPException(status_code=404, detail=comments["error"])
    return comments

# Получить статистику вопросов/ответов/лайков для конкретного пользователя 
@app.get("/users/{user_id}/statistics", response_model=UserStatistics)
async def get_user_statistics_endpoint(user_id: str):
    user_id = int(user_id)
    statistics = await get_user_statistics(user_id)
    if "error" in statistics:
        raise HTTPException(status_code=404, detail=statistics["error"])
    return statistics

# Получить список вопросов
@app.get("/users/{user_id}/tasks")
async def get_user_tasks_endpoint(user_id: int) -> Dict:
    result = await get_user_tasks(user_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# Изменить статус task на Done или Claim
@app.post("/tasks/{task_id}/{status}")
async def update_task_status_endpoint(
    task_id: int,
    status: str,  
    user_id: int = Query(..., description="The ID of the user")  # Query parameter
):
    result = await update_task_status(user_id, task_id, status)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# Получить список нотификаций
@app.get("/users/{user_id}/notifications")
async def get_user_notifications_endpoint(
    user_id: int,
    unread_only: bool = Query(True, description="Filter unread notifications only")
) -> List[Dict]:
    result = await get_notifications(user_id, unread_only)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

# Эндпоинт для отметки уведомлений как прочитанных
@app.post("/users/{user_id}/notifications/mark-as-read")
async def mark_notifications_as_read_endpoint(
    user_id: int,
    notification_ids: List[int]
) -> Dict:
    result = await mark_notifications_as_read(user_id, notification_ids)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

if __name__ == '__main__':
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
