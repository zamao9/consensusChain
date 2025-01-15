import { createSlice } from '@reduxjs/toolkit';

// Изначальное состояние достижений
const initialState = {
	achievements: [
		{
			id: 1,
			title: 'First Steps',
			text: 'Submit 3 questions.',
			goal: 3,
		},
		{
			id: 2,
			title: 'Curious Mind',
			text: 'Submit 10 questions.',
			goal: 10,
		},
		{
			id: 3,
			title: 'Question Master',
			text: 'Submit 20 questions.',
			goal: 20,
		},
	],
};

// Срез достижений
const achievementsSlice = createSlice({
	name: 'achievements',
	initialState,
	reducers: {
		// Установка всех достижений
		setAchievements(state, action) {
			state.achievements = action.payload;
		},
	},
});

// Экспортируем actions и редуктор
export const { setAchievements } = achievementsSlice.actions;
export default achievementsSlice.reducer;

// Структура Ачивок
// const achievementsData = [
// 	{
// 		key: 1,
// 		title: 'Bla bla bla',
// 		text: 'Submit more than 3 questions.',
// 		icon: <SuccessIcon />,
// 		done: true,
// 	},
// ];
