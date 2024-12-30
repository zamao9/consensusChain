import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние хранилища. Здесь мы храним массив комментариев.
const initialState = {
	comments: [
		{
			id: '1', // Уникальный идентификатор комментария
			questionId: '123', // ID вопроса, к которому относится комментарий
			text: 'I believe this question opens up a fascinating discussion!', // Текст комментария
			likes: 7, // Количество лайков у комментария
			dislikes: 2, // Количество дизлайков у комментария
			likedByUser: false, // Лайкнут ли комментарий текущим пользователем
			dislikedByUser: false, // Дизлайкнут ли комментарий текущим пользователем
		},
		{
			id: '2',
			questionId: '1234',
			text: 'This is an insightful take on the topic!',
			likes: 15,
			dislikes: 1,
			likedByUser: false,
			dislikedByUser: false,
		},
		{
			id: '3',
			questionId: '12345',
			text: 'There might never be a definitive answer to this mystery.',
			likes: 10,
			dislikes: 0,
			likedByUser: false,
			dislikedByUser: false,
		},
	],
};

// Создаем slice (часть состояния) для комментариев.
// Slice определяет начальное состояние и набор редьюсеров для управления этим состоянием.
const commentsSlice = createSlice({
	name: 'comments', // Название slice
	initialState, // Начальное состояние
	reducers: {
		// Редьюсер для переключения лайка на комментарий
		toggleLike: (state, action) => {
			const { commentId } = action.payload; // Извлекаем ID комментария из действия
			const comment = state.comments.find((c) => c.id === commentId); // Ищем комментарий по ID
			if (comment) {
				if (comment.likedByUser) {
					// Если пользователь уже лайкнул, отменяем лайк
					comment.likes -= 1;
					comment.likedByUser = false;
				} else {
					// Если дизлайкнут, убираем дизлайк
					if (comment.dislikedByUser) {
						comment.dislikes -= 1;
						comment.dislikedByUser = false;
					}
					// Добавляем лайк
					comment.likes += 1;
					comment.likedByUser = true;
				}
			}
		},
		// Редьюсер для переключения дизлайка на комментарий
		toggleDislike: (state, action) => {
			const { commentId } = action.payload; // Извлекаем ID комментария из действия
			const comment = state.comments.find((c) => c.id === commentId); // Ищем комментарий по ID
			if (comment) {
				if (comment.dislikedByUser) {
					// Если пользователь уже дизлайкнул, отменяем дизлайк
					comment.dislikes -= 1;
					comment.dislikedByUser = false;
				} else {
					// Если лайкнут, убираем лайк
					if (comment.likedByUser) {
						comment.likes -= 1;
						comment.likedByUser = false;
					}
					// Добавляем дизлайк
					comment.dislikes += 1;
					comment.dislikedByUser = true;
				}
			}
		},
		// Редьюсер для установки всех комментариев (например, при загрузке с сервера)
		setComments: (state, action) => {
			state.comments = action.payload; // Обновляем массив комментариев
		},
		// Редьюсер для добавления нового комментария
		addComment: (state, action) => {
			const { questionId, questionText } = action.payload; // Извлекаем ID вопроса и текст комментария
			console.log('action=', action);
			console.log('text=', questionText);

			const newComment = {
				id: String(Date.now()), // Генерируем уникальный ID для нового комментария
				questionId: questionId, // Привязываем комментарий к конкретному вопросу
				text: questionText, // Текст комментария
				likes: 0, // Изначально у комментария нет лайков
				dislikes: 0, // Изначально у комментария нет дизлайков
				likedByUser: false, // Текущий пользователь еще не лайкнул комментарий
				dislikedByUser: false, // Текущий пользователь еще не дизлайкнул комментарий
			};
			console.log(newComment);

			state.comments.push(newComment); // Добавляем новый комментарий в массив
		},
	},
});

// Экспортируем действия для использования в компонентах
export const { toggleLike, toggleDislike, setComments, addComment } = commentsSlice.actions;

// Экспортируем редьюсер для добавления в store
export default commentsSlice.reducer;
