import './commentsPage.sass';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { DislikeIcon, LikeIcon, ProfileIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import {
	setComments,
	toggleDislike,
	toggleLike,
} from '../../feature/comments/commentsSlice';
import { selectCommentsByQuestionId } from '../../feature/comments/commentsSelector';
import { selectUserId } from '../../feature/profile/profileSelector';
import {
	selectNotAnsweredQuestion,
	selectSelectedQuestion,
} from '../../feature/questions/questionsSelector';
import { updateQuestion } from '../../feature/questions/questionsSlice';

const CommentsPage = ({ setPopup, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const questionItem = useAppSelector(selectSelectedQuestion);
	const nextQuestion = useAppSelector(selectNotAnsweredQuestion); // Следующий неотвеченный вопрос
	const [questionsItem, setQuestionsItem] = useState(questionItem);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [nextCommentVisible, setNextCommentVisible] = useState(false);
	console.log(questionsItem)
	console.log("nextQuestion", nextQuestion)
	// Получаем ID текущего вопроса
	const questionId = questionsItem?.question_id || null;

	// Получаем комментарии для текущего вопроса
	const comments = useAppSelector(selectCommentsByQuestionId(questionId));

	// Функция для получения комментариев с сервера
	const getComments = async () => {
		if (!questionId) {
			console.warn('No questionId available to fetch comments.');
			return;
		}

		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${questionId}/comments?user_id=${userId}`,
				{
					method: 'GET',
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

	// Вызываем getComments при изменении questionId
	useEffect(() => {
		if (questionId) {
			getComments(); // Получаем комментарии для нового вопроса
		}
	}, [questionId]);

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

	// Обработчик реакций (лайк/дизлайк)
	const handleReaction = async (reactionType) => {
		if (!questionsItem) return;

		try {
			if (reactionType === 'like') {
				await likeComment(comments[currentIndex]?.commentId);

				// Проверяем, есть ли следующий неотвеченный вопрос
				if (nextQuestion) {
					dispatch(
						updateQuestion({
							question_id: questionsItem.question_id,
							updates: {
								answered: true,
							},
						})
					);
					setQuestionsItem(nextQuestion); // Обновляем questionsItem на новый вопрос
				} else {
					console.warn('No more unanswered questions available.');
					alert('No more unanswered questions available.');
				}
			} else if (reactionType === 'dislike') {
				await dislikeComment(comments[currentIndex]?.commentId);

				// Переключаемся на следующий комментарий
				if (currentIndex < comments.length - 1) {
					setTimeout(() => {
						setCurrentIndex(currentIndex + 1);
					}, 300);
				} else {
					setCurrentIndex(0); // Возвращаемся к первому комментарию
				}
			}
		} catch (error) {
			console.error('Error handling reaction:', error);
			alert('An error occurred while processing your reaction.');
		}
	};

	// Логика свайпов
	const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const cardRef = useRef(null);

	const handleDragStart = () => {
		setIsDragging(true);
		setNextCommentVisible(true); // Показываем следующий комментарий при начале перетаскивания
	};

	const lerp = (start, end, t) => start * (1 - t) + end * t;

	const handleDragMove = (e) => {
		if (!isDragging) return;

		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const rect = cardRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const offsetX = clientX - centerX;

		// Определяем направление движения
		const direction = offsetX > 0 ? 'right' : 'left';

		// Логика сглаживания и анимации
		const deadZone = 20;
		let adjustedOffsetX = offsetX;
		if (Math.abs(offsetX) < deadZone) {
			adjustedOffsetX = 0;
		}

		const maxRotation = 15;
		const targetRotation = Math.min(Math.max(adjustedOffsetX / 10, -maxRotation), maxRotation);
		const maxOffsetX = 500;
		const targetOffsetX = Math.min(Math.max(adjustedOffsetX, -maxOffsetX), maxOffsetX);

		const smoothedX = lerp(position.x, targetOffsetX, 0.2);
		const smoothedRotation = lerp(position.rotation, targetRotation, 0.2);

		setPosition({ x: smoothedX, y: 0, rotation: smoothedRotation });
	};

	const handleDragEnd = () => {
		if (!isDragging) return;

		// Логика завершения перетаскивания
		const threshold = 100;
		if (position.x > threshold) {
			dislikeComment(comments[currentIndex].commentId);
		} else if (position.x < -threshold) {
			likeComment(comments[currentIndex].commentId);
		}

		setPosition({ x: 0, y: 0, rotation: 0 });
		setIsDragging(false);

		if (currentIndex < comments.length - 1) {
			setTimeout(() => {
				setCurrentIndex(currentIndex + 1);
				setNextCommentVisible(false);
			}, 300);
		} else {
			setCurrentIndex(0);
			setNextCommentVisible(false);
		}
	};

	return (
		<div className='comments-page'>
			{/* Отображение текущего вопроса */}
			<QuestionsItem
				questionItem={questionsItem}
				comments={'comments-page'}
				setPopup={setPopup}
				setPopupText={setPopupText}
				setPopupSource={setPopupSource}
				answer={questionsItem?.answered}
				isCurrentElement={true}
			/>

			{/* Обертка свайпа ответов */}
			<div className='answers-block'>
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
					{comments.length > 0 && comments !== null ? (
						<>
							{/* Обертка данных ответа */}
							<div className='comment-card'>
								{/* Текст ответа */}
								<h2 className='answers__title lh--140 mb--16'>
									{comments[currentIndex].text}
								</h2>

								{/* Реакции на ответ */}
								<div className='reactions-counter mb--32'>
									{/* Лайк */}
									<div
										className={`reactions-counter__icon-wrapper ${comments[currentIndex].likedByUser ? 'active' : ''
											}`}
									>
										<LikeIcon />
										<span className='reactions-counter__count'>
											{comments[currentIndex].likes}
										</span>
									</div>

									{/* Дизлайк */}
									<div
										className={`reactions-counter__icon-wrapper ${comments[currentIndex].dislikedByUser ? 'active' : ''
											}`}
									>
										<DislikeIcon />
										<span className='reactions-counter__count'>
											{comments[currentIndex].dislikes}
										</span>
									</div>

									{/* Профиль ответчика */}
									<div className='user reactions-counter__user'>
										<ProfileIcon />
										<span className='user__name'>{questionsItem?.user_name}</span>
									</div>
								</div>
							</div>

							{/* Кнопки реакций */}
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

				{/* Нижний ответ */}
				{nextCommentVisible && currentIndex < comments.length - 1 && (
					<div className='answers answers__next-comment-card'>
						<h2 className='answers__title lh--140 mb--16'>
							{comments[currentIndex + 1]?.text}
						</h2>
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
								<span className='user__name'>{questionsItem?.user_name}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CommentsPage;