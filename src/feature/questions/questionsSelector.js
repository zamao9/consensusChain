import { createSelector } from 'reselect';

// Базовый селектор для получения ветки состояния, где хранятся вопросы
// Это "точка входа" для более сложных селекторов
const selectquestions = (state) => state.questions;

// Селектор для получения всех вопросов из состояния
// Если данных нет, возвращается пустой массив
export const selectQuestions = createSelector(
	[selectquestions], // Входной селектор
	(questions) => {
		//console.log('Questions state:', questions.questions); // Лог состояния (для отладки)
		return questions ? questions.questions : []; // Проверка на null/undefined
	}
);

// Селектор текущего вопроса
export const selectSelectedQuestion = createSelector(
	[selectquestions], // Входной селектор
	(questions) => {
		const selectedQuestionId = questions.selectedQuestionId; // Получаем ID выбранного вопроса
		if (!Array.isArray(questions.questions)) {
			console.warn('Questions data is not an array:', questions.questions); // Предупреждение о некорректных данных
			return null; // Возвращаем null, если данные некорректны
		}
		// Находим вопрос по question_id
		return questions.questions.find((q) => q.question_id === selectedQuestionId) || null;
	}
);

// Селектор для получения текущей страницы
// Извлекает значение currentPage из ветки состояния questions
export const selectCurrentPage = createSelector(
	[selectquestions],
	(questions) => questions.currentPage
);

// Селектор для получения количества вопросов на одной странице
// Извлекает значение questionsPerPage из ветки состояния questions
export const selectQuestionsPerPage = createSelector(
	[selectquestions],
	(questions) => questions.questionsPerPage
);

// Селектор для вычисления общего количества страниц
// Делит общее количество вопросов на количество вопросов на странице и округляет в большую сторону
export const selectTotalPages = createSelector(
	[selectQuestions, selectQuestionsPerPage], // Использует другие селекторы в качестве входных
	(questions, questionsPerPage) => {
		if (!Array.isArray(questions)) {
			console.warn('Questions data is not an array:', questions); // Предупреждение о некорректных данных
			return 0; // Возвращаем 0, если данные некорректны
		}
		return Math.ceil(questions.length / questionsPerPage); // Вычисляем количество страниц
	}
);

// Селектор для получения списка вопросов текущей страницы
// Использует текущую страницу, количество вопросов на странице и весь список вопросов
export const selectCurrentQuestionPageList = createSelector(
	[selectQuestions, selectCurrentPage, selectQuestionsPerPage],
	(questions, currentPage, questionsPerPage) => {
		if (!Array.isArray(questions)) {
			console.warn('Questions data is not an array:', questions); // Предупреждение о некорректных данных
			return [];
		}
		// Определяем индекс начала и конца текущей страницы
		const startIndex = (currentPage - 1) * questionsPerPage;
		return questions.slice(startIndex, startIndex + questionsPerPage); // Возвращаем подмассив для текущей страницы
	}
);
