import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tasks: [], // Изначально пусто, данные будут загружаться с сервера
	dailyTasks: [],
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
			if (state.dailyTasks.length === 0) {
				const initialList = action.payload;
				initialList.map((element) => {
					state.dailyTasks.push({
						title: element.dailyTaskText,
						cost: element.cost,
						type: 'question',
						url: element.dailyTaskUrl,
						clamed: element.is_claimed,
						done: element.is_done,
						timer: '12h 12m 12s',
					});
				});
			}
		},

		markDailyTaskDone(state, action) {
			const taskKey = action.payload;
			const task = state.dailyTasks.find((t) => t.title === taskKey);
			if (task) task.isDone = true;
		},
		claimDailyTask(state, action) {
			const taskKey = action.payload;
			const task = state.dailyTasks.find((t) => t.title === taskKey);
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
