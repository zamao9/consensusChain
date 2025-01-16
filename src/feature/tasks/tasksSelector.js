import { createSelector } from '@reduxjs/toolkit';

// Базовый селектор
export const selectTasksState = (state) => state.tasks;

// Селектор для всех задач
export const selectAllTasks = createSelector(selectTasksState, (tasksState) => tasksState.tasks);

// Селектор для видимых задач (не завершённых)
export const selectVisibleTasks = createSelector(selectAllTasks, (tasks) =>
	tasks.filter((task) => !task.isClaimed)
);
