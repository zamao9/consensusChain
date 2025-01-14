import { createSelector } from '@reduxjs/toolkit';

// Базовый селектор для профиля
export const selectProfile = (state) => state.profile;

// Селекторы для отдельных полей профиля
export const selectUserId = createSelector(selectProfile, (profile) => profile.id);
export const selectUserName = createSelector(selectProfile, (profile) => profile.name);
export const selectRegistrationDate = createSelector(
	selectProfile,
	(profile) => profile.registrationDate
);
export const selectUserBalance = createSelector(selectProfile, (profile) => profile.balance);
export const selectUserRating = createSelector(selectProfile, (profile) => profile.rating);
export const selectLikesReceived = createSelector(
	selectProfile,
	(profile) => profile.likesReceived
);
export const selectQuestionsCount = createSelector(
	selectProfile,
	(profile) => profile.questionsCount
);
export const selectAnswersCount = createSelector(selectProfile, (profile) => profile.answersCount);
export const selectReceivedAnswersCount = createSelector(
	selectProfile,
	(profile) => profile.receivedAnswersCount
);
