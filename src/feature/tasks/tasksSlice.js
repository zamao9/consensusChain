import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tasks: [], // Изначально пусто, данные будут загружаться с сервера
	dailyTasks: [
		{
			id: 1,
			title: '111111',
			cost: '12k',
			timer: '12h:12m:12s',
			type: null,
			url: null,
		},
	],
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

		setDailyTasks(state, action) {
			state.dailyTasks[0].title = action.payload; // Устанавливаем данные задач с сервера
		},
		markDailyTaskDone(state, action) {
			const taskKey = action.payload;
			const task = state.dailyTasks.find((t) => t.key === taskKey);
			if (task) task.isDone = true;
		},
		claimDailyTask(state, action) {
			const taskKey = action.payload;
			const task = state.dailyTasks.find((t) => t.key === taskKey);
			if (task) task.isClaimed = true;
		},
	},
});

export const {
	setTasks,
	markTaskDone,
	claimTask,
	setDailyTasks,
	markDailyTaskDone,
	claimDailyTask,
} = tasksSlice.actions;
export default tasksSlice.reducer;
