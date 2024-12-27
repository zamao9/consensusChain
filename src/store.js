// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './feature/notifications/notificationsSlice';
import questionsReducer from './feature/questions/questionsSlice';

export const store = configureStore({
	reducer: {
		notifications: notificationsReducer,
		questions: questionsReducer,
	},
});
