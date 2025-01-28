import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Генерация уникальных идентификаторов

// Изначальное состояние для среза. Оно содержит:
// 1. Список вопросов (questions) с начальными данными.
// 2. Текущую страницу (currentPage) для пагинации.
// 3. Количество вопросов на странице (questionsPerPage).
const initialState = {
	questions: [],
	currentPage: 1,
	questionsPerPage: 3,
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
			const newQuestion = { id: uuidv4(), ...action.payload }; // Генерация нового вопроса с уникальным ID
			state.questions.push(newQuestion); // Добавление вопроса в массив
		},

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

		deleteQuestion(state, action) {
			state.questions = state.questions.filter((q) => q.question_id !== action.payload); // Фильтрация массива для исключения вопроса
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
