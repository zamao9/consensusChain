import { createSelector } from 'reselect';

const selectquestions = (state) => state.questions;

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

export const selectNotAnsweredQuestion = createSelector(
	[selectQuestions], // Входной селектор
	(questions) => {
		if (!Array.isArray(questions)) {
			console.warn('Questions data is not an array:', questions); // Предупреждение о некорректных данных
			return null; // Возвращаем null, если данные некорректны
		}

		// Находим первый вопрос с ответами (commentsCount > 0)
		const questionWithComments = questions.find((q) => q.commentsCount > 0 && !q.answered);
		if (questionWithComments) {
			return questionWithComments;
		}

		// Если нет вопросов с ответами, возвращаем первый неотвеченный вопрос
		return questions.find((q) => !q.answered) || null;
	}
);

export const selectCurrentPage = createSelector(
	[selectquestions],
	(questions) => questions.currentPage
);

export const selectQuestionsPerPage = createSelector(
	[selectquestions],
	(questions) => questions.questionsPerPage
);

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
