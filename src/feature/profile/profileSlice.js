import { createSlice } from '@reduxjs/toolkit';
import { a } from 'framer-motion/client';

const initialState = {
	id: null, // Идентификатор пользователя
	name: 'gugugaga', // Имя пользователя
	registrationDate: '01.01.2025', // Дата регистрации
	balance: 0, // Баланс пользователя
	rating: 0, // Рейтинг пользователя
	likesReceived: 0, // Количество лайков, полученных на вопросы и ответы
	questionsCount: 5, // Количество созданных вопросов
	answersCount: 0, // Количество данных ответов
	receivedAnswersCount: 0, // Количество ответов, полученных на вопросы пользователя
	introdusingCheck: false,
	dailyTaskCheck: false,
};

const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setId: (state, action) => {
			state.id = action.payload;
		},
		setName: (state, action) => {
			state.name = action.payload;
		},
		setRegistrationDate: (state, action) => {
			state.registrationDate = action.payload;
		},
		setBalance: (state, action) => {
			state.balance = action.payload;
		},
		incrementBalance: (state, action) => {
			state.balance += action.payload;
		},
		setRating: (state, action) => {
			state.rating = action.payload;
		},
		incrementRating: (state, action) => {
			state.rating += action.payload;
		},
		setLikesReceived: (state, action) => {
			state.likesReceived = action.payload;
		},
		setQuestionsCount: (state, action) => {
			state.questionsCount = action.payload;
		},
		setAnswersCount: (state, action) => {
			state.answersCount = action.payload;
		},
		setReceivedAnswersCount: (state, action) => {
			state.receivedAnswersCount = action.payload;
		},
		setIntroducingCheck: (state, action) => {
			state.introdusingCheck = action.payload;
		},
		setDailyTaskCheck: (state, action) => {
			state.dailyTaskCheck = action.payload;
		},
	},
});

export const {
	setId,
	setName,
	setRegistrationDate,
	setBalance,
	incrementBalance,
	setRating,
	incrementRating,
	setLikesReceived,
	setQuestionsCount,
	setAnswersCount,
	setReceivedAnswersCount,
	setIntroducingCheck,
	setDailyTaskCheck,
} = profileSlice.actions;

export default profileSlice.reducer;
