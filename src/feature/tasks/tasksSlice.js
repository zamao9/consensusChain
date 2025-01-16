import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tasks: [
		{
			key: 1,
			title: 'Subscribe our discord channel.',
			isClaimed: false,
			isDone: false,
			cost: 1000,
			timer: '10:23:15',
		},
		{
			key: 2,
			title: 'Subscribe our telegram channel.',
			isClaimed: false,
			isDone: false,
			cost: 100,
			timer: '10:23:15',
		},
		{
			key: 3,
			title: 'Post your first public question.',
			isClaimed: false,
			isDone: false,
			cost: 300,
			timer: '10:23:15',
		},
		{
			key: 4,
			title: 'Post your first private question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '',
		},
		{
			key: 5,
			title: 'Answer your first public question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '',
		},
	], // Изначально пусто, данные будут загружаться с сервера
};

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setTasks(state, action) {
			state.tasks = action.payload; // Устанавливаем данные задач
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
