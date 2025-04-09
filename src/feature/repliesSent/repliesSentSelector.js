import { createSelector } from '@reduxjs/toolkit';
// Базовый селектор
export const selectRepliesSentState = (state) => state.repliesSent;

// Селектор для всех задач
export const selectRepliesSentList = createSelector(
	selectRepliesSentState,
	(repliseSent) => repliseSent.repliesSentList
);

export const selectCurrentPage = createSelector(
	selectRepliesSentState,
	(repliseSent) => repliseSent.currentPage
);

export const selectItemsPerList = createSelector(
	selectRepliesSentState,
	(repliseSent) => repliseSent.itemsPerPage
);

export const selectTotalPage = createSelector(
	[selectRepliesSentList, selectItemsPerList],
	(repliesSentData, itemsPerPage) => Math.ceil(repliesSentData.length / itemsPerPage)
);

export const selectCurrentPageCommentsList = createSelector(
	[selectRepliesSentList, selectCurrentPage, selectItemsPerList],
	(repliesSentData, currentPage, itemsPerPage) => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return repliesSentData.slice(startIndex, startIndex + itemsPerPage);
	}
);
