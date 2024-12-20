// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './feature/notifications/notificationsSlice';

export const store = configureStore({
	reducer: {
		notifications: notificationsReducer,
	},
});
