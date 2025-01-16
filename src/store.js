// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './feature/notifications/notificationsSlice';
import questionsReducer from './feature/questions/questionsSlice';
import commentsReducer from './feature/comments/commentsSlice';
import profileReducer from './feature/profile/profileSlice';
import achievementsReducer from './feature/achievements/achievementsSlice';
import tasksReducer from './feature/tasks/tasksSlice';

export const store = configureStore({
	reducer: {
		notifications: notificationsReducer,
		questions: questionsReducer,
		comments: commentsReducer,
		profile: profileReducer,
		achievements: achievementsReducer,
		tasks: tasksReducer,
	},
});
