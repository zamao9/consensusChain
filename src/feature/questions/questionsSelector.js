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

export const selectNotAnsweredQuestion = (currentQuestionId) =>
	createSelector(
		[selectQuestions], // Входной селектор
		(questions) => {
			if (!Array.isArray(questions)) {
				console.warn('Questions data is not an array:', questions); // Предупреждение о некорректных данных
				return null; // Возвращаем null, если данные некорректны
			}
			// Исключаем текущий вопрос из выборки
			const filteredQuestions = questions.filter((q) => q.question_id !== currentQuestionId);

			// Находим первый вопрос с ответами (commentsCount > 0)
			const questionWithComments = filteredQuestions.find(
				(q) => q.commentsCount > 0 && !q.answered
			);
			if (questionWithComments) {
				return questionWithComments;
			}
			// Если нет вопросов с ответами, возвращаем первый неотвеченный вопрос
			return filteredQuestions.find((q) => !q.answered) || null;
		}
	);

export const selectCurrentPage = createSelector(
	[selectquestions],
	(questions) => questions?.currentPage || 1 // Возвращаем значение по умолчанию (1), если currentPage отсутствует
);

export const selectQuestionsPerPage = createSelector(
	[selectquestions],
	(questions) => questions?.questionsPerPage || 3 // Возвращаем значение по умолчанию (3)
);

export const selectTotalPages = createSelector(
	[
		selectQuestions,
		selectQuestionsPerPage,
		(_, selectedTags, selectedLanguage) => ({ selectedTags, selectedLanguage }),
	],
	(questions, questionsPerPage, { selectedTags, selectedLanguage }) => {
		if (!Array.isArray(questions)) {
			console.warn('Questions data is not an array:', questions);
			return 0;
		}

		// Фильтруем вопросы
		const filteredQuestions = questions.filter((question) => {
			if (selectedLanguage && question.language !== selectedLanguage) return false;
			if (selectedTags.length > 0) {
				const questionTags = question.tags || [];
				return selectedTags.every((tag) => questionTags.includes(tag));
			}
			return true;
		});

		// Вычисляем количество страниц
		return Math.ceil(filteredQuestions.length / (questionsPerPage || 3)); // Значение по умолчанию (3)
	}
);

export const selectCurrentQuestionPageList = createSelector(
	[
		selectQuestions,
		selectCurrentPage,
		selectQuestionsPerPage,
		(_, selectedTags, selectedLanguage) => ({ selectedTags, selectedLanguage }),
	],
	(questions, currentPage, questionsPerPage, { selectedTags, selectedLanguage }) => {
		if (!Array.isArray(questions)) {
			console.warn('Questions data is not an array:', questions);
			return [];
		}

		// Фильтруем вопросы
		const filteredQuestions = questions.filter((question) => {
			if (selectedLanguage && question.language !== selectedLanguage) return false;
			//console.log(selectedTags)
			if (selectedTags.length > 0 && selectedTags[0] !== '') {
				const questionTags = question.tags || [];
				return selectedTags.every((tag) => questionTags.includes(tag));
			}
			return true;
		});

		// Разбиваем на страницы
		const startIndex = ((currentPage || 1) - 1) * (questionsPerPage || 3); // Значения по умолчанию
		return filteredQuestions.slice(startIndex, startIndex + (questionsPerPage || 3));
	}
);
