import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { DislikeIcon, LikeIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import './commentsPage.sass';
import { toggleDislike, toggleLike } from '../../feature/comments/commentsSlice';
import { selectCommentsByQuestionId } from '../../feature/comments/commentsSelector';

const CommentsPage = ({ questionsItem, setPopup, setPopupText, setPopupSource, answer }) => {
	const dispatch = useAppDispatch();
	const questionId = questionsItem.id;
	// Получаем комментарии для конкретного вопроса
	const comments = useAppSelector(selectCommentsByQuestionId(questionId));

	// Текущий индекс комментария
	const [currentIndex, setCurrentIndex] = useState(0);

	// Обработчики свайпов
	const handlers = useSwipeable({
		onSwipedLeft: () => handleReaction('dislike'),
		onSwipedRight: () => handleReaction('like'),
	});

	const handleReaction = (type) => {
		if (comments.length === 0) return;

		const currentComment = comments[currentIndex];
		if (type === 'like') {
			dispatch(toggleLike({ commentId: currentComment.id }));
		} else if (type === 'dislike') {
			dispatch(toggleDislike({ commentId: currentComment.id }));
		}

		// Переход к следующему комментарию
		if (currentIndex < comments.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			// Возврат к началу, если закончились комментарии
			setCurrentIndex(0);
		}
	};

	const resetAnswers = () => {
		setCurrentIndex(0);
	};

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
						<h2 className='answers__title lh--140 mb--16'>
							{comments[currentIndex].text}
						</h2>

						{/* Обертка Лайков и Дизлайков */}
						<div className='reactions-counter mb--32'>
							<div className='reactions-counter__icon-wrapper'>
								<LikeIcon />
								<span className='reactions-counter__count'>
									{comments[currentIndex].likes}
								</span>
							</div>
							<div className='reactions-counter__icon-wrapper'>
								<DislikeIcon />
								<span className='reactions-counter__count'>
									{comments[currentIndex].dislikes}
								</span>
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
