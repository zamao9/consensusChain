import { createSlice } from '@reduxjs/toolkit';
// Начальное состояние для уведомлений

const initialState = {
	notifications: [

	],
};

// Создаём срез уведомлений
export const notificationsSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		// Устанавливаем список уведомлений из БД
		setNotificationList(state, action) {
			state.notifications = action.payload;
		},
		// Добавляем новое уведомление
		addNotification(state, action) {
			state.notifications.push({
				id: action.payload.id,
				title: action.payload.title,
				text: action.payload.text,
				type: action.payload.type,
				isRead: false,
			});
		},
		// Помечаем уведомление как прочитанное по ID
		markAsRead(state, action) {
			const notification = state.notifications.find(
				(n) => n.id === action.payload
			);
			if (notification) {
				notification.isRead = true;
			}
		},
		// Удаляем уведомление по ID
		removeNotification(state, action) {
			state.notifications = state.notifications.filter(
				(n) => n.id !== action.payload
			);
		},
		// Изменение состояния анимации
		markRemoveAnimation(state, action) {
			const notification = state.notifications.find(
				(n) => n.id === action.payload
			);
			if (notification) {
				notification.animation = true;
			}
		},
	},
});

// Экспортируем действия
export const {
	setNotificationList,
	addNotification,
	markAsRead,
	removeNotification,
	markRemoveAnimation,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
