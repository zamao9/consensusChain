import './commentsPage.sass';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { DislikeIcon, LikeIcon, ProfileIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import { setComments, toggleDislike, toggleLike } from '../../feature/comments/commentsSlice';
import { selectCommentsByQuestionId } from '../../feature/comments/commentsSelector';
import { selectUserId } from '../../feature/profile/profileSelector';
import {
	selectNotAnsweredQuestion,
	selectSelectedQuestion,
} from '../../feature/questions/questionsSelector';
import { setSelectedQuestionId, updateQuestion } from '../../feature/questions/questionsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import Preloader from '../preloader/Preloader';

const CommentsPage = ({ setPopup, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const questionItem = useAppSelector(selectSelectedQuestion);
	const nextQuestion = useAppSelector(selectNotAnsweredQuestion); // Следующий неотвеченный вопрос
	const [questionsItem, setQuestionsItem] = useState(questionItem);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [nextCommentVisible, setNextCommentVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Loading state for fetching comments

	// Get the ID of the current question
	const questionId = questionsItem?.question_id || null;

	// Get comments for the current question
	const comments = useAppSelector(selectCommentsByQuestionId(questionId)) || [];

	// Fetch comments from the server
	const getComments = async () => {
		if (!questionId) {
			console.warn('No questionId available to fetch comments.');
			return;
		}
		setIsLoading(true); // Start loading
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
			dispatch(setComments(data)); // Save comments to state
		} catch (error) {
			console.error('Error fetching comments:', error);
			alert('Error fetching comments');
		} finally {
			setIsLoading(false); // Stop loading
		}
	};

	// Fetch comments when `questionId` changes
	useEffect(() => {
		if (questionId) {
			setCurrentIndex(0); // Reset currentIndex when switching questions
			getComments(); // Fetch comments for the new question
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

	// Reactions handler (like/dislike)
	const handleReaction = async (reactionType) => {
		if (!questionsItem && isLoading) return;
		try {
			if (reactionType === 'like') {
				const comentsId = comments[currentIndex]?.commentId;
				if (nextQuestion) {
					dispatch(
						updateQuestion({
							question_id: questionsItem.question_id,
							updates: {
								answered: true,
							},
						})
					);

					// Animate out the old question and animate in the new one
					setTimeout(() => {
						setQuestionsItem(nextQuestion);
						dispatch(setSelectedQuestionId(nextQuestion.question_id));
					}, 500); // Delay to allow animation to complete
				} else {
					console.warn('No more unanswered questions available.');
					alert('No more unanswered questions available.');
				}
				await likeComment(comentsId);
			} else if (reactionType === 'dislike') {
				await dislikeComment(comments[currentIndex]?.commentId);

				// Move to the next comment
				if (currentIndex < comments.length - 1) {
					setTimeout(() => {
						setCurrentIndex(currentIndex + 1);
					}, 10);
				} else {
					setCurrentIndex(0); // Return to the first comment
				}
			}
		} catch (error) {
			console.error('Error handling reaction:', error);
			alert('An error occurred while processing your reaction.');
		}
	};

	// Framer Motion variants for animations
	const questionVariants = {
		initial: { opacity: 0, y: -50 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
		exit: { opacity: 0, x: 200, transition: { duration: 0.5 } },
	};

	const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const cardRef = useRef(null);

	// Linear interpolation function
	const lerp = (start, end, t) => start * (1 - t) + end * t;

	// Handle drag start
	const handleDragStart = () => {
		setIsDragging(true);
		setNextCommentVisible(true); // Show the next comment when dragging starts
	};

	// Handle drag move
	const handleDragMove = (e) => {
		if (!isDragging) return;

		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const clientY = e.touches ? e.touches[0].clientY : e.clientY;

		const rect = cardRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const offsetX = clientX - centerX;
		const offsetY = clientY - centerY;

		// Determine direction of movement
		const direction =
			Math.abs(offsetX) > Math.abs(offsetY)
				? offsetX > 0
					? 'right'
					: 'left'
				: offsetY > 0
				? 'down'
				: 'up';

		setHoverState({ isDragging: true, direction });

		// Smoothed offsets and rotation
		const deadZone = 20;
		let adjustedOffsetX = Math.abs(offsetX) < deadZone ? 0 : offsetX;
		let adjustedOffsetY = Math.abs(offsetY) < deadZone ? 0 : offsetY;

		const maxRotation = 15;
		const targetRotation = Math.min(Math.max(adjustedOffsetX / 10, -maxRotation), maxRotation);

		const maxOffsetX = 500;
		const maxOffsetY = 300;

		const targetOffsetX = Math.min(Math.max(adjustedOffsetX, -maxOffsetX), maxOffsetX);
		const targetOffsetY = Math.min(Math.max(adjustedOffsetY, -maxOffsetY), maxOffsetY);

		const smoothedX = lerp(position.x, targetOffsetX, 0.2);
		const smoothedY = lerp(position.y, targetOffsetY, 0.2);
		const smoothedRotation = lerp(position.rotation, targetRotation, 0.2);

		setPosition({ x: smoothedX, y: smoothedY, rotation: smoothedRotation });
	};

	// Handle drag end
	const handleDragEnd = () => {
		if (!isDragging) return;

		setHoverState({ isDragging: false, direction: null });

		const threshold = 100;

		if (Math.abs(position.x) > threshold || Math.abs(position.y) > threshold) {
			if (position.x > threshold) {
				dislikeComment(comments[currentIndex].commentId);
			} else if (position.x < -threshold) {
				likeComment(comments[currentIndex].commentId);
			}
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

	const [hoverState, setHoverState] = useState({
		isDragging: false,
		direction: null, // 'left' или 'right'
	});

	return (
		<div className='comments-page'>
			{/* Отображение текущего вопроса */}
			<AnimatePresence mode='wait'>
				<motion.div
					key={questionsItem?.question_id}
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, x: -200 }}
					transition={{ duration: 0.5 }}
				>
					<QuestionsItem
						questionItem={questionsItem}
						comments={'comments-page'}
						setPopup={setPopup}
						setPopupText={setPopupText}
						setPopupSource={setPopupSource}
						answer={questionsItem?.answered}
						isCurrentElement={true}
					/>
				</motion.div>
			</AnimatePresence>

			{/* Обертка свайпа ответов */}
			<div className='answers-block'>
				{isLoading && (
					<Preloader
						isVisible={isLoading}
						color='#CECECE'
						size={60}
						message='Please wait, fetching data...'
					/>
				)}
				{!isLoading && (
					<>
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
										<h2 className='answers__title lh--140 mb--16'>{comments[currentIndex].text}</h2>

										{/* Реакции на ответ */}
										<div className='reactions-counter mb--32'>
											{/* Лайк */}
											<div
												className={`reactions-counter__icon-wrapper ${
													comments[currentIndex].likedByUser ? 'active' : ''
												}`}
											>
												<LikeIcon />
												<span className='reactions-counter__count'>
													{comments[currentIndex].likes}
												</span>
											</div>

											{/* Дизлайк */}
											<div
												className={`reactions-counter__icon-wrapper ${
													comments[currentIndex].dislikedByUser ? 'active' : ''
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
										{/* Кнопка лайка */}
										<button
											type='button'
											className={`reactions__button ${
												hoverState.isDragging && hoverState.direction === 'left' ? 'like-hover' : ''
											}`}
											onClick={() => handleReaction('like')}
										>
											<LikeIcon />
										</button>

										{/* Кнопка дизлайка */}
										<button
											type='button'
											className={`reactions__button ${
												hoverState.isDragging && hoverState.direction === 'right'
													? 'dislike-hover'
													: ''
											}`}
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
					</>
				)}
			</div>
		</div>
	);
};

export default CommentsPage;
