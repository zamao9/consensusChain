import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Генерация уникальных идентификаторов

const initialState = {
    questions: [
        {
            id: uuidv4(),
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
            id: uuidv4(),
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
            id: uuidv4(),
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
            id: uuidv4(),
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

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        setQuestions(state, action) {
            state.questions = action.payload;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        setQuestionsPerPage(state, action) {
            state.questionsPerPage = action.payload;
        },
        addQuestion(state, action) {
            const newQuestion = { id: uuidv4(), ...action.payload };
            state.questions.push(newQuestion);
        },
        updateQuestion(state, action) {
            const { id, updates } = action.payload;
            const questionIndex = state.questions.findIndex((q) => q.id === id);
            if (questionIndex !== -1) {
                state.questions[questionIndex] = { ...state.questions[questionIndex], ...updates };
            }
        },
        deleteQuestion(state, action) {
            state.questions = state.questions.filter((q) => q.id !== action.payload);
        },
    },
});

export const {
    setQuestions,
    setCurrentPage,
    setQuestionsPerPage,
    addQuestion,
    updateQuestion,
    deleteQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;