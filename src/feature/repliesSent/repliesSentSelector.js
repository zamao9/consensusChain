import { createSelector } from '@reduxjs/toolkit';
// Базовый селектор
export const selectRepliseSentState = (state) => state.repliesSent;

// Селектор для всех задач
export const selectRepliesSentList = createSelector(
	selectRepliseSentState,
	(repliseSent) => repliseSent.repliesSentList
);

export const selectCurrentPage = createSelector(
	selectRepliseSentState,
	(repliseSent) => repliseSent.currentPage
);

export const selectItemsPerList = createSelector(
	selectRepliseSentState,
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
