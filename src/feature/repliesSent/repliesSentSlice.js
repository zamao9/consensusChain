import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	repliesSentList: [
		{
			id: 1,
			text: 'One guy shoves exactly one can into his rectum.',
			likes: 7,
			dislikes: 9,
		},
		{
			id: 2,
			text: 'A human anus can stretch up to 7 inches. A raccoon can squeeze into a 4 inch hole, which means you can put two raccoons up your arse.',
			likes: 16,
			dislikes: 4,
		},
		{
			id: 3,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
		{
			id: 4,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
		{
			id: 5,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
		{
			id: 6,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
		{
			id: 7,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
		{
			id: 8,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
	],
	currentPage: 1,
	itemsPerPage: 5,
};

const repliesSentSlice = createSlice({
	name: 'repliesSent',
	initialState,
	reducers: {
		setRepliesSent(state, action) {
			state.repliesSentList = action.payload;
		},
		addRepliesSentItem(state, action) {
			state.repliesSentList.push({
				id: action.payload.id,
				text: action.payload.text,
				likes: action.payload.likes,
				dislikes: action.payload.dislikes,
				link: action.payload.link,
			});
		},
		setCurrentPage(state, action) {
			const index = action.payload;
			state.currentPage = index;
		},
	},
});

export const { setRepliesSent, setCurrentPage } = repliesSentSlice.actions;
export default repliesSentSlice.reducer;
