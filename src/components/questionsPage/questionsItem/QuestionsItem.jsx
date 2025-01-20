import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateQuestion } from '../../../feature/questions/questionsSlice';
import {
	CommentsIcon,
	LikeIcon,
	NotificationIcon,
	ProfileIcon,
	ReportIcon,
	StarIcon,
} from '../../../constants/SvgIcons';
import { useAppDispatch } from '../../../hooks/store';

const QuestionsItem = ({
	userId,
	questionsItem,
	comments,
	setPopup,
	setPopupText,
	setPopupSource,
	answer,
	setPage,
	setQuestionsItem,
	setItem,
}) => {
	const dispatch = useAppDispatch();
	const [isProcessing, setIsProcessing] = useState(false);
	// Функция для отправки запроса на лайк или дизлайк
	const handleLike = async () => {
		if (isProcessing) return;
		setIsProcessing(true);

		const likeStatus = !questionsItem.like;
		const updatedLikeCount = likeStatus
			? questionsItem.likeCount + 1
			: questionsItem.likeCount - 1;

		try {
			// Отправляем запрос на сервер для обновления лайка
			const response = await fetch(`http://localhost:8000/questions/${questionsItem.question_id}/like`, {
				method: 'POST',
				body: JSON.stringify({
					user_id: userId,  // Передаем user_id в теле запроса
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Проверяем, что сервер вернул успешный ответ
			if (response.ok) {
				// Обновляем состояние в Redux
				dispatch(
					updateQuestion({
						id: questionsItem.id,
						updates: {
							like: likeStatus,
							likeCount: updatedLikeCount,
						},
					})
				);
			} else {
				throw new Error('Failed to like the question');
			}
		} catch (error) {
			console.error("Error liking question:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	// Функция для отправки запроса на репорт
	const handleReport = async () => {
		if (isProcessing) return;
		setIsProcessing(true);

		try {
			// Отправляем запрос на сервер для репорта вопроса
			const response = await fetch(`http://localhost:8000/questions/${questionsItem.question_id}/report`, {
				method: 'POST',
				body: JSON.stringify({
					user_id: userId,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Проверяем, что сервер вернул успешный ответ
			if (response.ok) {
				// Обновляем состояние в Redux
				dispatch(
					updateQuestion({
						id: questionsItem.id,
						updates: { report: !questionsItem.report },
					})
				);
				setPopup(true);
				setPopupText('Your report has been successfully sent.');
				setPopupSource('report-page');
			} else {
				throw new Error('Failed to report the question');
			}
		} catch (error) {
			console.error("Error reporting question:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	// Функция для отправки запроса на отслеживание вопроса
	const handleTrace = async () => {
		if (isProcessing) return;
		setIsProcessing(true);

		try {
			// Отправляем запрос на сервер для отслеживания вопроса
			const response = await fetch(`http://localhost:8000/questions/${questionsItem.question_id}/trace`, {
				method: 'POST',
				body: JSON.stringify({
					user_id: userId,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Проверяем, что сервер вернул успешный ответ
			if (response.ok) {
				// Обновляем состояние в Redux
				dispatch(
					updateQuestion({
						id: questionsItem.id,
						updates: { trace: !questionsItem.trace },
					})
				);
			} else {
				throw new Error('Failed to trace the question');
			}
		} catch (error) {
			console.error("Error tracing question:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<li className='questions-page__item'>
			{comments === 'questions-page' && (
				<div
					className={`button questions-page__button questions-page__popular ${questionsItem.popular === false ? 'none' : ''
						}`}
				>
					<StarIcon />
				</div>
			)}

			<h2 className='title lh--140 questions-page__title'>{questionsItem.title}</h2>

			<ul className='tags'>
				{questionsItem.tags.map((tag, id) => (
					<li className='tags__item' key={id} id={id}>
						{tag}
					</li>
				))}
			</ul>

			<div className='user questions-page__user'>
				<ProfileIcon />
				<span className='user__name'>{questionsItem.user_name}</span>
			</div>

			<div className='questions-page__buttons-wrapper'>
				<div className='questions-page__buttons'>
					<button
						type='button'
						className={`button questions-page__button questions-page__report ${questionsItem.report ? 'active' : ''
							}`}
						onClick={handleReport}
						disabled={isProcessing}
					>
						<ReportIcon />
					</button>

					<button
						type='button'
						className={`button questions-page__button questions-page__trace ${questionsItem.trace ? 'active' : ''
							}`}
						onClick={handleTrace}
						disabled={isProcessing}
					>
						<NotificationIcon />
					</button>

					<div className='questions-page__like-wrapper'>
						<button
							type='button'
							className={`button questions-page__button questions-page__like ${questionsItem.like ? 'active' : ''
								}`}
							onClick={handleLike}
							disabled={isProcessing}
						>
							<LikeIcon />
						</button>
						<span className='questions-page__likeCount'>{questionsItem.likeCount}</span>
					</div>
				</div>

				{comments === 'questions-page' && (
					<button
						type='button'
						className='button questions-page__button questions-page__comments'
						onClick={() => {
							setPage('comments-page');
							setQuestionsItem(questionsItem);
							setItem('');
						}}
					>
						<CommentsIcon />
					</button>
				)}

				{comments === 'comments-page' && (
					<button
						type='button'
						className='questions-page__button questions-page__leave-a-comment'
						disabled={answer}
						onClick={() => {
							setPopup(true);
							setPopupText('Your reply was successfully sent.');
							setPopupSource('answer');
						}}
					>
						Answer
					</button>
				)}
			</div>
		</li>
	);
};

export default QuestionsItem;
