import { createSelector } from 'reselect';

// Базовый селектор для состояния уведомлений
const selectNotifications = (state) => state.notifications.notifications;

// Селектор для получения всех уведомлений (сортируем по непрочитанным в начале)
export const selectAllNotifications = createSelector(
	[selectNotifications],
	(notifications) =>
		[...notifications].sort((a, b) => Number(a.isRead) - Number(b.isRead))
);

// Селектор для получения только непрочитанных уведомлений
export const selectUnreadNotifications = createSelector(
	[selectNotifications],
	(notifications) =>
		notifications.filter((notification) => !notification.isRead)
);
