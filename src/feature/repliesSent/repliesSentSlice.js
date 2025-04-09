import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	repliesSentList: [],
	currentPage: 1,
	itemsPerPage: 5,
};

const repliesSentSlice = createSlice({
	name: 'repliesSent',
	initialState,
	reducers: {
		setRepliesSent(state, action) {
			if (state.repliesSentList.length === 0) {
				const initialList = action.payload;
				initialList.map((element) => {
					state.repliesSentList.push({
						id: element.commentId,
						text: element.text,
						likes: element.likes,
						dislikes: element.dislikes,
						questionId: element.questionId,
					});
				});
			}
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
