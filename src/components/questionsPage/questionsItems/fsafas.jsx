import React, { useState } from "react";

const questionsData = [
  {
    id: 1,
    name: "How can I improve my daily fitness routine?",
    tags: ["Health", "Fitness"],
    isFavorite: false,
    isReported: false,
    isLiked: false,
    likesCount: 42,
  },
  {
    id: 2,
    name: "What is the best way to deal with stress at work?",
    tags: ["Health", "Stress"],
    isFavorite: true,
    isReported: false,
    isLiked: true,
    likesCount: 33,
  },
  {
    id: 3,
    name: "How do I start a healthy diet without feeling overwhelmed?",
    tags: ["Health", "Nutrition"],
    isFavorite: false,
    isReported: true,
    isLiked: false,
    likesCount: 27,
  },
  {
    id: 4,
    name: "What are some tips for improving sleep quality?",
    tags: ["Health", "Sleep"],
    isFavorite: true,
    isReported: false,
    isLiked: false,
    likesCount: 18,
  },
  {
    id: 5,
    name: "How can I stay motivated to exercise regularly?",
    tags: ["Fitness", "Motivation"],
    isFavorite: false,
    isReported: true,
    isLiked: true,
    likesCount: 15,
  },
];

const QuestionsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  // Пагинация
  const totalPages = Math.ceil(questionsData.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const displayedQuestions = questionsData.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  // обработчики
  const toggleFavorite = (id) => {
    const question = questionsData.find((q) => q.id === id);
    question.isFavorite = !question.isFavorite;
  };

  const toggleLike = (id) => {
    const question = questionsData.find((q) => q.id === id);
    if (question.isLiked) {
      question.likesCount -= 1;
    } else {
      question.likesCount += 1;
    }
    question.isLiked = !question.isLiked;
  };

  const reportQuestion = (id) => {
    const question = questionsData.find((q) => q.id === id);
    if (!question.isReported) {
      question.isReported = true;
    }
  };

  return (
    <div className="questions-list">
      {displayedQuestions.map((question) => (
        <div key={question.id} className="question-item">
          <h3 className="question-title">{question.name}</h3>
          <div className="question-tags">
            {question.tags.map((tag, index) => (
              <span key={index} className="question-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="question-actions">
            <button
              className={`favorite-btn ${question.isFavorite ? "active" : ""}`}
              onClick={() => toggleFavorite(question.id)}
            >
              {question.isFavorite ? "★" : "☆"}
            </button>
            <button
              className={`like-btn ${question.isLiked ? "active" : ""}`}
              onClick={() => toggleLike(question.id)}
            >
              👍 {question.likesCount}
            </button>
            <button
              className="report-btn"
              onClick={() => reportQuestion(question.id)}
              disabled={question.isReported}
            >
              {question.isReported ? "Reported" : "Report"}
            </button>
            <button className="answer-btn">Answer</button>
          </div>
        </div>
      ))}
