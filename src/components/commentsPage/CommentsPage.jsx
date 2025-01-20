import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { DislikeIcon, LikeIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import './commentsPage.sass';
import { setComments, toggleDislike, toggleLike } from '../../feature/comments/commentsSlice';
import { selectCommentsByQuestionId } from '../../feature/comments/commentsSelector';
import { selectUserId } from '../../feature/profile/profileSelector';

const CommentsPage = ({ questionsItem, setPopup, setPopupText, setPopupSource, answer }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const questionId = questionsItem.question_id;
	// Текущий индекс комментария
	const [currentIndex, setCurrentIndex] = useState(0);

	const getComments = async () => {
		try {
			const response = await fetch(`http://localhost:8000/questions/${questionId}/comments?user_id=5499493097`, {
				method: 'GET',  // Используем GET запрос
				headers: {
					'Content-Type': 'application/json'
				},
			});
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

	// Функция для отправки лайка на сервер
	const likeComment = async (commentId) => {
		try {
			const response = await fetch(`http://localhost:8000/comments/${commentId}/like`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ user_id: userId }),
			});

			if (response.ok) {
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
			const response = await fetch(`http://localhost:8000/comments/${commentId}/dislike`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ user_id: userId }),
			});

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
			likeComment(currentComment.commentsId); // Отправляем запрос на лайк
		} else if (type === 'dislike') {
			dislikeComment(currentComment.commentsId); // Отправляем запрос на дизлайк
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

	// Получаем комментарии для конкретного вопроса
	const comments = useAppSelector(selectCommentsByQuestionId(questionId));
	//console.log(comments);
	return (
		<div className='comments-page'>
			{/* Комментарий */}
			<QuestionsItem
				questionsItem={questionsItem}
				comments={'comments-page'}
				setPopup={setPopup}
				setPopupText={setPopupText}
				setPopupSource={setPopupSource}
				answer={answer}
			/>

			{/* Ответы */}
			<div {...handlers} className='answers mt--16'>
				{comments.length > 0 ? (
					<>
						{/* Текст ответа */}
						<h2 className='answers__title lh--140 mb--16'>{comments[currentIndex].text}</h2>

						{/* Обертка Лайков и Дизлайков */}
						<div className='reactions-counter mb--32'>
							<div className='reactions-counter__icon-wrapper'>
								<LikeIcon />
								<span className='reactions-counter__count'>{comments[currentIndex].likes}</span>
							</div>
							<div className='reactions-counter__icon-wrapper'>
								<DislikeIcon />
								<span className='reactions-counter__count'>{comments[currentIndex].dislikes}</span>
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
