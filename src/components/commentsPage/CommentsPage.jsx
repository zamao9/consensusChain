import './commentsPage.sass';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { DislikeIcon, LikeIcon, ProfileIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import { setComments, toggleDislike, toggleLike } from '../../feature/comments/commentsSlice';
import { selectCommentsByQuestionId } from '../../feature/comments/commentsSelector';
import { selectUserId } from '../../feature/profile/profileSelector';
import { selectSelectedQuestion } from '../../feature/questions/questionsSelector';

const CommentsPage = ({ setPopup, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const questionsItem = useAppSelector(selectSelectedQuestion);
	const questionId = questionsItem?.question_id || null;
	const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [nextCommentVisible, setNextCommentVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	// Ссылка на текущий элемент
	const cardRef = useRef(null);

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
			dispatch(setComments(data)); // Сохраняем комментарии в состоянии
		} catch (error) {
			console.error('Error fetching comments:', error);
			alert('Error fetching comments');
		}
	};

	useEffect(() => {
		getComments(); // Получаем комментарии при загрузке▲
	}, [questionId]);

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
	const handleDragStart = () => {
		setIsDragging(true);
		setNextCommentVisible(true); // Показываем следующий комментарий при начале перетаскивания
	};

	const lerp = (start, end, t) => start * (1 - t) + end * t;

	const handleDragMove = (e) => {
		if (!isDragging) return;

		// Получаем координаты мыши или тача
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const rect = cardRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2; // Центр карточки по оси X
		const offsetX = clientX - centerX; // Смещение относительно центра

		// Добавляем "мертвую зону"
		const deadZone = 20;
		let adjustedOffsetX = offsetX;
		if (Math.abs(offsetX) < deadZone) {
			adjustedOffsetX = 0;
		}

		// Ограничиваем угол поворота
		const maxRotation = 15;
		const targetRotation = Math.min(Math.max(adjustedOffsetX / 10, -maxRotation), maxRotation);

		// Ограничиваем смещение по оси X
		const maxOffsetX = 500;
		const targetOffsetX = Math.min(Math.max(adjustedOffsetX, -maxOffsetX), maxOffsetX);

		// Применяем сглаживание
		const smoothedX = lerp(position.x, targetOffsetX, 0.2); // 0.2 — коэффициент сглаживания
		const smoothedRotation = lerp(position.rotation, targetRotation, 0.2);

		setPosition({ x: smoothedX, y: 0, rotation: smoothedRotation });
	};

	// Обработчик окончания перетаскивания
	const handleDragEnd = () => {
		if (!isDragging) return;

		// Активируем действие, если смещение превышает порог
		const threshold = 100;
		if (position.x > threshold) {
			dislikeComment(comments[currentIndex].commentId);
		} else if (position.x < -threshold) {
			likeComment(comments[currentIndex].commentId);
		}

		// Сбрасываем состояние
		setPosition({ x: 0, y: 0, rotation: 0 });
		setIsDragging(false);

		// Переход к следующему комментарию
		if (currentIndex < comments.length - 1) {
			setTimeout(() => {
				setCurrentIndex(currentIndex + 1);
				setNextCommentVisible(false); // Скрываем следующий комментарий после завершения анимации
			}, 300);
		} else {
			setCurrentIndex(0);
			setNextCommentVisible(false);
		}
	};

	return (
		<div className='comments-page'>
			{/* Комментарии */}
			<QuestionsItem
				questionItem={questionsItem}
				comments={'comments-page'}
				setPopup={setPopup}
				setPopupText={setPopupText}
				setPopupSource={setPopupSource}
				answer={questionsItem.answered}
				isCurrentElement={true}
			/>

			{/* Обертка свайпа ответов */}
			<div className='answers-block'>
				{/* Верхний ответ */}
				<div
					className='answers mt--16'
					ref={cardRef}
					style={{
						transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
					}}
					onMouseDown={handleDragStart}
					onMouseMove={handleDragMove}
					onMouseUp={handleDragEnd}
					onTouchStart={handleDragStart}
					onTouchMove={handleDragMove}
					onTouchEnd={handleDragEnd}
				>
					{comments.length > 0 ? (
						<>
							{/* Обертка данных ответа */}
							<div className='comment-card'>
								{/* Текст ответа */}
								<h2 className='answers__title lh--140 mb--16'>{comments[currentIndex].text}</h2>

								{/* Реакции на ответ */}
								<div className='reactions-counter mb--32'>
									{/* Обертка Лайк / Дизлайк */}
									<div
										className={`reactions-counter__icon-wrapper ${
											comments[currentIndex].likedByUser ? 'active' : ''
										}`}
									>
										<LikeIcon />

										{/* Счетчик Лайка */}
										<span className='reactions-counter__count'>{comments[currentIndex].likes}</span>
									</div>

									{/* Обертка Лайк / Дизлайк */}
									<div
										className={`reactions-counter__icon-wrapper ${
											comments[currentIndex].dislikedByUser ? 'active' : ''
										}`}
									>
										<DislikeIcon />

										{/* Счетчик Лайка */}
										<span className='reactions-counter__count'>
											{comments[currentIndex].dislikes}
										</span>
									</div>

									{/* Профиль ответчика */}
									<div className='user reactions-counter__user'>
										<ProfileIcon />
										<span className='user__name'>{questionsItem.user_name}</span>
									</div>
								</div>
							</div>

							{/* Кнопки для десктопной версии */}
							<div className='reactions'>
								{/* Кнопки лайка */}
								<button
									type='button'
									className='reactions__button'
									onClick={() => handleReaction('like')}
								>
									<LikeIcon />
								</button>

								{/* Кнопки дизлайка */}
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

				{/* Нижний ответ */}
				{nextCommentVisible && currentIndex < comments.length - 1 && (
					<div
						className='answers answers__next-comment-card'
						style={{
							opacity: nextCommentVisible ? 1 : 0,
						}}
					>
						<h2 className='answers__title lh--140 mb--16'>{comments[currentIndex + 1]?.text}</h2>
						<div className='reactions-counter mb--32'>
							<div className='reactions-counter__icon-wrapper'>
								<LikeIcon />
								<span className='reactions-counter__count'>
									{comments[currentIndex + 1]?.likes}
								</span>
							</div>
							<div className='reactions-counter__icon-wrapper'>
								<DislikeIcon />
								<span className='reactions-counter__count'>
									{comments[currentIndex + 1]?.dislikes}
								</span>
							</div>
							<div className='user reactions-counter__user'>
								<ProfileIcon />
								<span className='user__name'>{questionsItem.user_name}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CommentsPage;
