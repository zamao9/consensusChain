import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	friends: [
		{
			id: 1,
			userName: 'gugugaga',
			userRating: 509,
			trash: false,
		},
		{
			id: 2,
			userName: 'maxGraph',
			userRating: 8080,
			trash: false,
		},
		{
			id: 3,
			userName: 'shamaich',
			userRating: 3235,
			trash: false,
		},
	],
	currentPage: 0,
	totalPage: 0,
	friendsPerList: 10,
};

const friendsSlice = createSlice({
	name: 'friends',
	initialState,
	reducers: {
		setFriends(state, action) {
			const friends = action.payload;
			state.friends = friends;
		},
		setCurrentPage(state, action) {
			state.currentPage = action.payload;
		},
		removeFriend(state, action) {
			state.friends = state.friends.filter((n) => n.id !== action.payload);
		},
		changeRating(state, action) {
			const [id, value] = action.payload;

			const friendIndex = state.friends.findIndex((element) => element.id === id);

			state.friends[friendIndex].userRating = value;
		},
		changeTrash(state, action) {
			const friendIndex = state.friends.findIndex((element) => element.id === action.payload);

			state.friends[friendIndex].trash = !state.friends[friendIndex].trash;
		},
	},
});

export const { setFriends, setCurrentPage, removeFriend, changeRating, changeTrash } =
	friendsSlice.actions;
export default friendsSlice.reducer;
