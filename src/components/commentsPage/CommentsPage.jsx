import './commentsPage.sass';
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
	const nextQuestion = useAppSelector(selectNotAnsweredQuestion(questionItem?.question_id)); // Следующий неотвеченный вопрос
	const [questionsItem, setQuestionsItem] = useState(questionItem);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [nextCommentVisible, setNextCommentVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Loading state for fetching comments

	// Get the ID of the current question
	const questionId = questionsItem?.question_id || null;

	const comments = useAppSelector(selectCommentsByQuestionId(questionId)) || [];
	const [commentsState, setCommentsState] = useState([]); // Инициализируем пустым массивом

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
			dispatch(setComments(data));
			setCommentsState(data); // Save comments to state
		} catch (error) {
			console.error('Error fetching comments:', error);
			alert('Error fetching comments');
		} finally {
			setIsLoading(false); // Stop loading
		}
	};

	useEffect(() => {
		if (currentIndex === 0) {
			getComments();
		} // Синхронизируем локальное состояние с Redux
	}, [currentIndex]);

	// Fetch comments when `questionId` changes
	useEffect(() => {
		console.log('question change');
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
				setCommentsState((prevComments) =>
					prevComments.map((comment) =>
						comment.commentId === commentId
							? {
									...comment,
									likedByUser: !comment.likedByUser,
									dislikedByUser: !comment.likedByUser ? false : comment.dislikedByUser,
									likes: comment.likedByUser ? comment.likes - 1 : comment.likes + 1,
									dislikes: comment.dislikedByUser ? comment.dislikes - 1 : comment.dislikes,
							  }
							: comment
					)
				);
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
				setCommentsState((prevComments) =>
					prevComments.map((comment) =>
						comment.commentId === commentId
							? {
									...comment,
									dislikedByUser: !comment.dislikedByUser,
									likedByUser: !comment.dislikedByUser ? false : comment.likedByUser,
									dislikes: comment.dislikedByUser ? comment.dislikes - 1 : comment.dislikes + 1,
									likes: comment.likedByUser ? comment.likes - 1 : comment.likes,
							  }
							: comment
					)
				);
				dispatch(toggleDislike({ commentId }));
			} else {
				throw new Error('Failed to dislike the comment');
			}
		} catch (error) {
			console.error('Error disliking comment:', error);
			alert('Error disliking comment');
		}
	};

	const [buttonProcessing, setButtonProcessing] = useState(false);

	//useEffect(() => {
	//		console.log("Updated comments:", comments);
	//	}, [comments]);

	useEffect(() => {
		console.log('Updated currentIndex:', currentIndex);
	}, [currentIndex]);

	useEffect(() => {
		console.log('Updated buttonProcessing:', buttonProcessing);
	}, [buttonProcessing]);

	// Reactions handler (like/dislike)
	const handleReaction = async (reactionType) => {
		if (!questionsItem || isLoading || buttonProcessing) return;
		console.log('Reaction started:', reactionType);
		setButtonProcessing(true); // Блокируем кнопки
		try {
			if (reactionType === 'like') {
				const commentId = commentsState[currentIndex]?.commentId;
				if (nextQuestion) {
					dispatch(
						updateQuestion({
							question_id: questionsItem.question_id,
							updates: {
								answered: true,
							},
						})
					);
					setTimeout(() => {
						setQuestionsItem(nextQuestion);
						dispatch(setSelectedQuestionId(nextQuestion.question_id));
					}, 10);
				} else {
					console.warn('No more unanswered questions available.');
					alert('No more unanswered questions available.');
				}
				await likeComment(commentId);
			} else if (reactionType === 'dislike') {
				const commentId = commentsState[currentIndex]?.commentId;
				await dislikeComment(commentId); // Сначала дождемся завершения dislikeComment
				setCurrentIndex((prevIndex) => {
					//console.log("After dislikeComment:", { prevIndex, commentsLength: commentsState.length });
					if (prevIndex < commentsState.length - 1) {
						return prevIndex + 1;
					} else {
						return 0; // Возвращаемся к первому комментарию
					}
				});
			}
		} catch (error) {
			console.error('Error handling reaction:', error);
			alert('An error occurred while processing your reaction.');
		} finally {
			setButtonProcessing(false); // Разблокируем кнопки
		}
	};
	//console.log(currentIndex)
	// Framer Motion variants for animations
	const questionVariants = {
		initial: { opacity: 0, y: -50 },
		animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
		exit: { opacity: 0, x: -200, transition: { duration: 0.5 } },
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
		const deadZone = 10;
		let adjustedOffsetX = Math.abs(offsetX) < deadZone ? 0 : offsetX;
		let adjustedOffsetY = Math.abs(offsetY) < deadZone ? 0 : offsetY;

		const maxRotation = 15;
		const targetRotation = Math.min(Math.max(adjustedOffsetX / 10, -maxRotation), maxRotation);
		const maxOffsetX = 500;
		const maxOffsetY = 300;

		const targetOffsetX = Math.min(Math.max(adjustedOffsetX, -maxOffsetX), maxOffsetX);
		const targetOffsetY = Math.min(Math.max(adjustedOffsetY, -maxOffsetY), maxOffsetY);

		const smoothedX = lerp(position.x, targetOffsetX, 0.3);
		const smoothedY = lerp(position.y, targetOffsetY, 0.3);
		const smoothedRotation = lerp(position.rotation, targetRotation, 0.3);

		setPosition({ x: smoothedX, y: smoothedY, rotation: smoothedRotation });
	};

	// Handle drag end
	const handleDragEnd = () => {
		if (!isDragging) return;
		setHoverState({ isDragging: false, direction: null });

		const threshold = 50;
		if (Math.abs(position.x) > threshold || Math.abs(position.y) > threshold) {
			if (position.x > threshold) {
				animateCardExit('right');
				dislikeComment(comments[currentIndex]?.commentId);
			} else if (position.x < -threshold) {
				animateCardExit('left');
				likeComment(comments[currentIndex]?.commentId);
			}
		} else {
			resetCardPosition();
		}
	};

	// Анимация "улетания"
	const animateCardExit = (direction) => {
		const exitAnimation = {
			x: direction === 'left' ? '-200%' : '200%',
			opacity: 0,
			transition: { duration: 0.5 },
		};

		// Запускаем анимацию через framer-motion
		cardRef.current.animate(
			[
				{
					transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`,
				},
				{ transform: `translate(${exitAnimation.x}, 0px)`, opacity: 0 },
			],
			{ duration: 500, easing: 'ease-out' }
		);

		setTimeout(() => {
			if (currentIndex < commentsState.length - 1) {
				setCurrentIndex(currentIndex + 1);
			} else {
				setCurrentIndex(0);
			}
			setNextCommentVisible(false);
			resetCardPosition();
		}, 500);
	};

	// Сброс позиции карточки
	const resetCardPosition = () => {
		setPosition({ x: 0, y: 0, rotation: 0 });
	};

	const [hoverState, setHoverState] = useState({
		isDragging: false,
		direction: null, // 'left' или 'right'
	});

	const cardVariants = {
		initial: { opacity: 0, x: 0 },
		animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
		exit: { opacity: 0, x: -200, transition: { duration: 0.5 } }, // Свайп влево
	  };

	return (
		<div className="comments-page">
		  {/* Отображение текущего вопроса */}
		  <AnimatePresence mode="wait">
			<motion.div
			  key={questionsItem?.question_id}
			  initial="initial"
			  animate="animate"
			  exit="exit"
			  variants={questionVariants}
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
		  <div className="answers-block">
			{isLoading && (
			  <Preloader
				isVisible={isLoading}
				color="#CECECE"
				size={60}
				message="Please wait, fetching data..."
			  />
			)}
			{!isLoading && (
			  <>
				<AnimatePresence mode="wait">
				  <motion.div
					key={currentIndex} // Уникальный ключ для каждой карточки
					className="answers mt--16"
					variants={cardVariants}
					initial="initial"
					animate="animate"
					exit="exit"
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
					{commentsState.length > 0 && commentsState !== null ? (
					  <>
						{/* Обертка данных ответа */}
						<div className="comment-card">
						  {/* Текст ответа */}
						  <h2 className="answers__title lh--140 mb--16">
							{commentsState[currentIndex]?.text || 'waiting text'}
						  </h2>
						  {/* Реакции на ответ */}
						  <div className="reactions-counter mb--32">
							{/* Лайк */}
							<div
							  className={`reactions-counter__icon-wrapper ${
								commentsState[currentIndex].likedByUser ? 'active' : ''
							  }`}
							>
							  <LikeIcon />
							  <span className="reactions-counter__count">
								{commentsState[currentIndex]?.likes || 0}
							  </span>
							</div>
							{/* Дизлайк */}
							<div
							  className={`reactions-counter__icon-wrapper ${
								commentsState[currentIndex].dislikedByUser ? 'active' : ''
							  }`}
							>
							  <DislikeIcon />
							  <span className="reactions-counter__count">
								{commentsState[currentIndex]?.dislikes || 0}
							  </span>
							</div>
							{/* Профиль ответчика */}
							<div className="user reactions-counter__user">
							  <ProfileIcon />
							  <span className="user__name">{questionsItem?.user_name}</span>
							</div>
						  </div>
						</div>
						{/* Кнопки реакций */}
						<div className="reactions">
						  {/* Кнопка лайка */}
						  <button
							type="button"
							className={`reactions__button ${
							  hoverState.isDragging && hoverState.direction === 'left'
								? 'like-hover'
								: ''
							}`}
							onClick={() => handleReaction('like')}
						  >
							<LikeIcon />
						  </button>
						  {/* Кнопка дизлайка */}
						  <button
							type="button"
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
				  </motion.div>
				</AnimatePresence>
	  
				{/* Нижний ответ */}
				{nextCommentVisible && currentIndex < commentsState.length - 1 && (
				  <div className="answers answers__next-comment-card">
					<h2 className="answers__title lh--140 mb--16">
					  {commentsState[currentIndex + 1]?.text}
					</h2>
					<div className="reactions-counter mb--32">
					  <div className="reactions-counter__icon-wrapper">
						<LikeIcon />
						<span className="reactions-counter__count">
						  {commentsState[currentIndex + 1]?.likes}
						</span>
					  </div>
					  <div className="reactions-counter__icon-wrapper">
						<DislikeIcon />
						<span className="reactions-counter__count">
						  {commentsState[currentIndex + 1]?.dislikes}
						</span>
					  </div>
					  <div className="user reactions-counter__user">
						<ProfileIcon />
						<span className="user__name">{questionsItem?.user_name}</span>
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
