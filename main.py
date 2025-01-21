import os
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from models import CommentRequest, GetCommentsRequest, LikeDislikeRequest, Question, UserStatistics
from services import create_comment, create_question, dislike_comment, get_comments, get_questions, get_user_data, get_user_statistics, like_comment, like_question, report_question, trace_question

# MongoDB settings
#mongo_uri = "mongodb://localhost:27017"
mongo_uri = "mongodb://mongo:HeyufqSNrHrUOvoBEKdJAVANABdfytPb@autorack.proxy.rlwy.net:51943"
client = AsyncIOMotorClient(mongo_uri)
db = client.consensusChainDB

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        yield
    finally:
        client.close()

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
    user_id = request.user_id
    title = request.title
    tags = request.tags
    return await create_question(user_id, title, tags)

# Лайк/дизлайк вопроса пользователем
@app.post("/questions/{question_id}/like")
async def like_or_dislike_question(question_id: str, request: LikeDislikeRequest):
    user_id = request.user_id
    return await like_question(user_id, question_id)

# Добавить или убрать вопрос из наблюдаемых
@app.post("/questions/{question_id}/trace")
async def trace_or_untrace_question(question_id: str, request: LikeDislikeRequest):
    user_id = request.user_id
    return await trace_question(user_id, question_id)

# Пожаловаться на вопрос
@app.post("/questions/{question_id}/report")
async def report_or_unreport_question(question_id: str, request: LikeDislikeRequest):
    user_id = request.user_id
    return await report_question(user_id, question_id)

# Получить все вопросы пользователя
@app.get("/questions/{user_id}")
async def fetch_questions(user_id: str, allQuestions: bool = True):
    response = await get_questions(user_id, allQuestions)
    if isinstance(response, dict) and "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

#Добавить коммент
@app.post("/questions/{question_id}/comments")
async def add_comment(question_id: str, request: CommentRequest):
    user_id = request.user_id
    text = request.text
    response = await create_comment(user_id, question_id, text)
    if "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

# Лайкнуть комментарий
@app.post("/comments/{comment_id}/like")
async def like_comment_endpoint(comment_id: str, request: LikeDislikeRequest):
    user_id = request.user_id
    response = await like_comment(user_id, comment_id)
    if "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

# Дизлайкнуть комментарий
@app.post("/comments/{comment_id}/dislike")
async def dislike_comment_endpoint(comment_id: str, request: LikeDislikeRequest):
    user_id = request.user_id
    response = await dislike_comment(user_id, comment_id)
    if "error" in response:
        raise HTTPException(status_code=404, detail=response["error"])
    return response

# Получить комментарии к вопросу
@app.get("/questions/{question_id}/comments")
async def get_comments_endpoint(question_id: str, user_id: str):
    comments = await get_comments(question_id, user_id)
    if "error" in comments:
        raise HTTPException(status_code=404, detail=comments["error"])
    return comments

# Получить статистику вопросов/ответов/лайков для конкретного пользователя 
@app.get("/users/{user_id}/statistics", response_model=UserStatistics)
async def get_user_statistics_endpoint(user_id: str):
    statistics = await get_user_statistics(user_id)
    if "error" in statistics:
        raise HTTPException(status_code=404, detail=statistics["error"])
    return statistics

if __name__ == '__main__':
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
