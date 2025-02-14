#models.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Модель для пользователяы
class User(BaseModel):
    user_id: int
    fullName: Optional[str] = None
    userName: Optional[str] = None
    registrationDate: str
    tasks: List[dict] = Field(default_factory=list)
    achievements: List[dict] = Field(default_factory=list)
    notifications: List[dict] = Field(default_factory=list)
    balance: float = 0.0
    rating: int = 0
    questionsPerDay: int = 0
    likedQuestions: List[str] = Field(default_factory=list)  # Список ID вопросов, лайкнутых пользователем
    reportedQuestions: List[str] = Field(default_factory=list)  # Список ID вопросов, репортнутых пользователем
    traceQuestions: List[str] = Field(default_factory=list)  # Список ID вопросов, за которыми пользователь следит
    likedComments: List[str] = Field(default_factory=list)  # Список ID ответов, лайкнутых пользователем
    dislikedComments: List[str] = Field(default_factory=list)  # Список ID ответов, дизлайкнутых пользователем

# Модель для вопроса
class Question(BaseModel):
    user_id: str
    title: str
    tags: List[str] = []
    language: str 

# Модель для комментария 
class CommentRequest(BaseModel):
    user_id: str
    text: str

# Модель для лайка/дизлайка комментария
class LikeDislikeRequest(BaseModel):
    user_id: str

# Модель для получения комментариев
class GetCommentsRequest(BaseModel):
    user_id: str

# Модель для статистики
class UserStatistics(BaseModel):
    likesReceived: int
    questionsCount: int
    answersCount: int
    receivedAnswersCount: int

