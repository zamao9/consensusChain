import { createSelector } from '@reduxjs/toolkit';

// Базовый селектор для профиля
export const selectProfile = (state) => state.profile;

// Базовый селектор для достижений
export const selectAchievements = (state) => state.achievements;

// Селектор для достижений с расчетом прогресса
export const selectAchievementsWithProgress = createSelector(
	[selectAchievements, selectProfile],
	(achievementsState, profileState) => {
		const questionsCount = profileState.questionsCount || 0; // Получаем количество вопросов, защита от undefined

		return achievementsState.achievements.map((achievement) => {
			const percentage =
				achievement.goal > 0
					? Math.min((questionsCount / achievement.goal) * 100, 100) // Защита от деления на ноль
					: 0;

			return {
				...achievement,
				progress: questionsCount, // Текущий прогресс (количество вопросов)
				percentage: percentage.toFixed(2), // Процент выполнения
				done: questionsCount >= achievement.goal, // Выполнено или нет
			};
		});
	}
);
