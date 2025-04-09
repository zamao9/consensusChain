import { createSelector } from 'reselect';

const selectFriends = (state) => state.friends;

/* Возвращает массив friends */
export const selectAllFriends = createSelector([selectFriends], (friends) => {
	return friends ? friends.friends : [];
});

export const filteredFriends = createSelector([selectAllFriends], (friends) => {
	return [...friends].sort((b, a) => Number(a.userRating) - Number(b.userRating));
});

export const selectCurrentPage = createSelector(selectFriends, (friends) => friends.currentPage);

export const selectItemsPerList = createSelector(
	selectFriends,
	(friends) => friends.friendsPerList
);

export const selectTotalPage = createSelector(
	[selectAllFriends, selectItemsPerList],
	(friendsData, itemsPerPage) => Math.ceil(friendsData.length / itemsPerPage)
);

export const selectCurrentPageFriendsItems = createSelector(
	[selectAllFriends, selectCurrentPage, selectItemsPerList],
	(friendsData, currentPage, itemsPerPage) => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return friendsData.slice(startIndex, startIndex + itemsPerPage);
	}
);
