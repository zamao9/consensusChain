import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { DislikeIcon, LikeIcon, ProfileIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import './commentsPage.sass';
import { setComments, toggleDislike, toggleLike } from '../../feature/comments/commentsSlice';
import { selectCommentsByQuestionId } from '../../feature/comments/commentsSelector';
import { selectUserId } from '../../feature/profile/profileSelector';
import { selectSelectedQuestion } from '../../feature/questions/questionsSelector';

const CommentsPage = ({ setPopup, setPopupText, setPopupSource, answer }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const questionsItem = useAppSelector(selectSelectedQuestion);
	const questionId = questionsItem?.question_id || null;

	const [currentIndex, setCurrentIndex] = useState(0);

	const getComments = async () => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${questionId}/comments?user_id=5499493097`,
				{
					method: 'GET', // Используем GET запрос
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (!response.ok) {
				throw new Error('Failed to fetch comments');
			}
			const data = await response.json();
			//console.log("comments data-->", data);
			dispatch(setComments(data)); // Сохраняем комментарии в состоянии
		} catch (error) {
			console.error('Error fetching comments:', error);
			alert('Error fetching comments');
		}
	};

	// Получаем комментарии для конкретного вопроса
	const comments = useAppSelector(selectCommentsByQuestionId(questionId));

	// Функция для отправки лайка на сервер
	const likeComment = async (commentId) => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/comments/${commentId.toString()}/like`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ user_id: userId.toString() }),
				}
			);

			if (response.ok) {
				console.log('yep');
				dispatch(toggleLike({ commentId }));
			} else {
				throw new Error('Failed to like the comment');
			}
		} catch (error) {
			console.error('Error liking comment:', error);
			alert('Error liking comment');
		}
	};
	// Функция для отправки дизлайка на сервер
	const dislikeComment = async (commentId) => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/comments/${commentId.toString()}/dislike`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ user_id: userId.toString() }),
				}
			);

			if (response.ok) {
				dispatch(toggleDislike({ commentId }));
			} else {
				throw new Error('Failed to dislike the comment');
			}
		} catch (error) {
			console.error('Error disliking comment:', error);
			alert('Error disliking comment');
		}
	};

	// Обработчики свайпов
	const handlers = useSwipeable({
		onSwipedLeft: () => handleReaction('dislike'),
		onSwipedRight: () => handleReaction('like'),
	});

	// Обработчик лайка и дизлайка
	const handleReaction = (type) => {
		if (comments.length === 0) return;

		const currentComment = comments[currentIndex];

		if (type === 'like') {
			likeComment(currentComment.commentId); // Отправляем запрос на лайк
		} else if (type === 'dislike') {
			dislikeComment(currentComment.commentId); // Отправляем запрос на дизлайк
		}

		// Переход к следующему комментарию
		if (currentIndex < comments.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			// Возврат к началу, если закончились комментарии
			setCurrentIndex(0);
		}
	};

	// Загружаем комментарии при монтировании компонента
	useEffect(() => {
		getComments(); // Получаем комментарии при загрузке
	}, [questionId]);

	return (
		<div className='comments-page'>
			{/* Комментарий */}
			<QuestionsItem
				questionItem={questionsItem}
				comments={'comments-page'}
				setPopup={setPopup}
				setPopupText={setPopupText}
				setPopupSource={setPopupSource}
				answer={answer}
				isCurrentElement={true}
			/>

			{/* Ответы */}
			<div {...handlers} className='answers mt--16'>
				{comments.length > 0 ? (
					<>
						{/* Текст ответа */}
						<h2 className='answers__title lh--140 mb--16'>{comments[currentIndex].text}</h2>

						{/* Обертка Лайков и Дизлайков */}
						<div className='reactions-counter mb--32'>
							<div
								className={`reactions-counter__icon-wrapper ${
									comments[currentIndex].likedByUser ? 'active' : ''
								}`}
							>
								<LikeIcon />
								<span className='reactions-counter__count'>{comments[currentIndex].likes}</span>
							</div>
							<div
								className={`reactions-counter__icon-wrapper ${
									comments[currentIndex].dislikedByUser ? 'active' : ''
								}`}
							>
								<DislikeIcon />
								<span className='reactions-counter__count'>{comments[currentIndex].dislikes}</span>
							</div>

							{/* Никнейм ответчика */}
							<div className='user reactions-counter__user'>
								<ProfileIcon />
								<span className='user__name'>{questionsItem.user_name}</span>
							</div>
						</div>

						{/* Свайпер Лайка и Дизлайка */}
						<div className='reactions'>
							<button
								type='button'
								className='reactions__button'
								onClick={() => handleReaction('like')}
							>
								<LikeIcon />
							</button>
							<button
								type='button'
								className='reactions__button'
								onClick={() => handleReaction('dislike')}
							>
								<DislikeIcon />
							</button>
						</div>
					</>
				) : (
					<p>No comments available for this question.</p>
				)}
			</div>
		</div>
	);
};

export default CommentsPage;
