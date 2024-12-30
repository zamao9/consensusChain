import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Генерация уникальных идентификаторов


// Изначальное состояние для среза. Оно содержит:
// 1. Список вопросов (questions) с начальными данными.
// 2. Текущую страницу (currentPage) для пагинации.
// 3. Количество вопросов на странице (questionsPerPage).
const initialState = {
    questions: [
        {
            id: "123",
            title: 'How many pupupupupu?',
            popular: true,
            tags: ['Health', 'Coast', 'Nature'],
            user: 'gugugaga',
            report: false,
            trace: false,
            like: false,
            likeCount: 93,
        },
        {
            id: "1234",
            title: 'How many?',
            popular: true,
            tags: ['Education', 'Health', 'Philosophy'],
            user: 'jimineitron',
            report: false,
            trace: false,
            like: false,
            likeCount: 70,
        },
        {
            id: "12345",
            title: 'Who killed Kennedy?',
            popular: false,
            tags: ['Policy', 'Education', 'History'],
            user: 'timbeam',
            report: false,
            trace: false,
            like: false,
            likeCount: 10,
        },
        {
            id: "123456",
            title: 'Who can kill Putin?',
            popular: false,
            tags: ['Policy', 'Education', 'History'],
            user: 'foxy',
            report: false,
            trace: false,
            like: false,
            likeCount: 0,
        },
    ], // Все вопросы
    currentPage: 1, // Текущая страница
    questionsPerPage: 3, // Количество вопросов на странице
};

// Создание среза (slice) с помощью createSlice. Это упрощает работу с состоянием Redux:
// 1. Автоматически создаются действия (actions) на основе редьюсеров.
// 2. Снижается количество шаблонного кода.
const questionsSlice = createSlice({
    name: 'questions', // Уникальное имя среза. Используется для создания пространств имен.
    initialState, // Изначальное состояние среза
    reducers: {
        /**
         * Устанавливает новый список вопросов.
         * @param {Object} state - Текущее состояние.
         * @param {Object} action - Действие с полезной нагрузкой (payload).
         * payload: Массив новых вопросов для замены старого списка.
         */
        setQuestions(state, action) {
            state.questions = action.payload;
        },

        /**
         * Устанавливает текущую страницу.
         * @param {Object} state - Текущее состояние.
         * @param {Object} action - Действие с полезной нагрузкой.
         * payload: Номер страницы.
         */
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },

        /**
         * Устанавливает количество вопросов на странице.
         * @param {Object} state - Текущее состояние.
         * @param {Object} action - Действие с полезной нагрузкой.
         * payload: Число вопросов на странице.
         */
        setQuestionsPerPage(state, action) {
            state.questionsPerPage = action.payload;
        },

        /**
         * Добавляет новый вопрос в список.
         * Генерирует уникальный ID для вопроса перед добавлением.
         * @param {Object} state - Текущее состояние.
         * @param {Object} action - Действие с полезной нагрузкой.
         * payload: Объект нового вопроса (без id).
         */
        addQuestion(state, action) {
            const newQuestion = { id: uuidv4(), ...action.payload }; // Генерация нового вопроса с уникальным ID
            state.questions.push(newQuestion); // Добавление вопроса в массив
        },

        /**
         * Обновляет данные существующего вопроса.
         * Находит вопрос по ID и применяет переданные изменения.
         * @param {Object} state - Текущее состояние.
         * @param {Object} action - Действие с полезной нагрузкой.
         * payload: Объект с `id` вопроса и `updates` (изменениями).
         */
        updateQuestion(state, action) {
            const { id, updates } = action.payload; // Деструктуризация: извлекаем id и updates
            const questionIndex = state.questions.findIndex((q) => q.id === id); // Поиск вопроса по id
            if (questionIndex !== -1) {
                // Если вопрос найден, обновляем его данные
                state.questions[questionIndex] = {
                    ...state.questions[questionIndex],
                    ...updates,
                };
            }
        },

        /**
         * Удаляет вопрос из списка по ID.
         * @param {Object} state - Текущее состояние.
         * @param {Object} action - Действие с полезной нагрузкой.
         * payload: ID вопроса, который нужно удалить.
         */
        deleteQuestion(state, action) {
            state.questions = state.questions.filter((q) => q.id !== action.payload); // Фильтрация массива для исключения вопроса
        },
    },
});

// Экспортируем автоматически созданные действия для использования в компонентах.
export const {
    setQuestions, // Установить новый список вопросов
    setCurrentPage, // Установить текущую страницу
    setQuestionsPerPage, // Установить количество вопросов на страницу
    addQuestion, // Добавить новый вопрос
    updateQuestion, // Обновить существующий вопрос
    deleteQuestion, // Удалить вопрос
} = questionsSlice.actions;

// Экспортируем редьюсер для подключения к хранилищу Redux.
export default questionsSlice.reducer;