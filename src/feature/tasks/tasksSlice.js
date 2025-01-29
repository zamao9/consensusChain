import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tasks: [

	], // Изначально пусто, данные будут загружаться с сервера
};

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setTasks(state, action) {
			state.tasks = action.payload; // Устанавливаем данные задач с сервера
		},
		markTaskDone(state, action) {
			const taskKey = action.payload;
			const task = state.tasks.find((t) => t.key === taskKey);
			if (task) task.isDone = true;
		},
		claimTask(state, action) {
			const taskKey = action.payload;
			const task = state.tasks.find((t) => t.key === taskKey);
			if (task) task.isClaimed = true;
		},
	},
});

export const { setTasks, markTaskDone, claimTask } = tasksSlice.actions;
export default tasksSlice.reducer;
