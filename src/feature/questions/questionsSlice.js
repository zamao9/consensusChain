import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Генерация уникальных идентификаторов

const initialState = {
	questions: [],
	currentPage: 1,
	questionsPerPage: 3,
	selectedQuestionId: 1,
};

const questionsSlice = createSlice({
	name: 'questions',
	initialState,
	reducers: {
		setQuestions(state, action) {
			state.questions = action.payload;
		},

		setSelectedQuestionId(state, action) {
			state.selectedQuestionId = action.payload;
		},

		setCurrentPage(state, action) {
			state.currentPage = action.payload;
		},

		setQuestionsPerPage(state, action) {
			state.questionsPerPage = action.payload;
		},

		addQuestion(state, action) {
			const newQuestion = { question_id: uuidv4(), ...action.payload }; // Генерация нового вопроса с уникальным ID
			state.questions.push(newQuestion); // Добавление вопроса в массив
		},

		updateQuestion(state, action) {
			const { question_id, updates } = action.payload; // Деструктуризация: извлекаем id и updates
			const questionIndex = state.questions.findIndex((q) => q.question_id === question_id); // Поиск вопроса по id
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
	setSelectedQuestionId,
} = questionsSlice.actions;

// Экспортируем редьюсер для подключения к хранилищу Redux.
export default questionsSlice.reducer;
