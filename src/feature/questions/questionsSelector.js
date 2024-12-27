import { createSelector } from 'reselect';

// Базовый селектор для получения вопросов
const selectquestions = (state) => state.questions;

// Селектор для получения всех вопросов
export const selectQuestions = createSelector(
    [selectquestions],
    (questions) => {
        console.log('Questions state:', questions.questions);  // Логирование состояния
        return questions ? questions.questions : [];  // Проверка на null/undefined
    }
);

// Селектор для получения текущей страницы
export const selectCurrentPage = createSelector(
    [selectquestions],
    (questions) => questions.currentPage
);

// Селектор для получения количества вопросов на странице
export const selectQuestionsPerPage = createSelector(
    [selectquestions],
    (questions) => questions.questionsPerPage
);

// Селектор для вычисления общего количества страниц
export const selectTotalPages = createSelector(
    [selectQuestions, selectQuestionsPerPage],
    (questions, questionsPerPage) => {
        if (!Array.isArray(questions)) {
            console.warn("Questions data is not an array:", questions);
            return 0; // Возвращаем 0, если данные некорректны
        }
        return Math.ceil(questions.length / questionsPerPage);
    }
);


// Селектор для получения списка вопросов текущей страницы
export const selectCurrentQuestionPageList = createSelector(
    [selectQuestions, selectCurrentPage, selectQuestionsPerPage],
    (questions, currentPage, questionsPerPage) => {
        if (!Array.isArray(questions)) {
            console.warn("Questions data is not an array:", questions);
            return [];
        }
        const startIndex = (currentPage - 1) * questionsPerPage;
        return questions.slice(startIndex, startIndex + questionsPerPage);
    }
);
