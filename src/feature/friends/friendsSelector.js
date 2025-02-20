import { createSelector } from 'reselect';

const selectFriends = (state) => state.friends;

/* Возвращает массив friends */
export const selectAllFriends = createSelector([selectFriends], (friends) => {
	return friends ? friends.friends : [];
});

export const filteredFriends = createSelector([selectAllFriends], (friends) => {
	return [...friends].sort((b, a) => Number(a.userRating) - Number(b.userRating));
});
