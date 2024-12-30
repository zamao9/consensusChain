import { createSelector } from '@reduxjs/toolkit';

// Селектор для получения всех комментариев
export const selectAllComments = (state) => state.comments.comments;

// Селектор для получения комментариев по конкретному `questionId`
export const selectCommentsByQuestionId = (questionId) =>
	createSelector([selectAllComments], (comments) =>
		comments.filter((comment) => comment.questionId === questionId)
	);

// Селектор для получения количества лайков и дизлайков по `questionId`
export const selectReactionCountByQuestionId = (questionId) =>
	createSelector([selectCommentsByQuestionId(questionId)], (comments) => {
		let likes = 0;
		let dislikes = 0;

		comments.forEach((comment) => {
			likes += comment.likes;
			dislikes += comment.dislikes;
		});

		return { likes, dislikes };
	});

// Селектор для получения информации о конкретном комментарии
export const selectCommentById = (id) =>
	createSelector([selectAllComments], (comments) => comments.find((comment) => comment.id === id));

// Селектор для получения активности пользователя на комментариях
export const selectUserActivityByQuestionId = (questionId, userId) =>
	createSelector([selectCommentsByQuestionId(questionId)], (comments) =>
		comments.filter((comment) => comment.userId === userId)
	);
