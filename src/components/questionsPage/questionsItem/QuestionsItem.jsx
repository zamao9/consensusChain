import { useState, useEffect } from 'react';
import { setSelectedQuestionId, updateQuestion } from '../../../feature/questions/questionsSlice';
import {
	CommentsIcon,
	LikeIcon,
	NotificationIcon,
	ProfileIcon,
	ReportIcon,
	StarIcon,
} from '../../../constants/SvgIcons';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { ClipLoader } from 'react-spinners';
import { selectUserId } from '../../../feature/profile/profileSelector';
import { selectSelectedQuestion } from '../../../feature/questions/questionsSelector';
import CountUp from 'react-countup';

const QuestionsItem = ({
	questionItem,
	comments,
	setPopup,
	setPopupText,
	setPopupSource,
	answer,
	setPage,
	setItem,
	isCurrentElement,
}) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isProcessing, setIsProcessing] = useState(false);
	const selectedQuestion = useAppSelector(selectSelectedQuestion);

	// Обновляем локальное состояние при изменении вопроса или флага isCurrentElement
	useEffect(() => {
		if (isCurrentElement) {
			setQuestionsItem(selectedQuestion); // Обновляем текущий вопрос
		} else {
			setQuestionsItem(questionItem); // Используем переданный вопрос
		}
	}, [isCurrentElement, selectedQuestion, questionItem]);

	const [questionsItem, setQuestionsItem] = useState(
		isCurrentElement ? selectedQuestion : questionItem
	);

	const [startValue, setStartValue] = useState(0);
	const [endValue, setEndValue] = useState(questionsItem.likeCount);
	console.log('startValue = ', startValue, ' endValue = ', endValue);

	useEffect(() => {
		if (startValue === 0 && endValue === 0) {
			// Первый рендер: анимация начинается с 0 до текущего значения userBalance
			setEndValue(questionsItem.likeCount);
		} else {
			// Последующие обновления: анимация от предыдущего значения до нового
			setStartValue(endValue);
			setEndValue(questionsItem.likeCount);
		}
	}, [questionsItem.likeCount]);

	// Функция для отправки запроса на лайк или дизлайк
	const handleLike = async () => {
		if (isProcessing) return;
		setIsProcessing(true);
		const likeStatus = !questionsItem.like;
		const updatedLikeCount = likeStatus ? questionsItem.likeCount + 1 : questionsItem.likeCount - 1;
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${questionsItem.question_id.toString()}/like`,
				{
					method: 'POST',
					body: JSON.stringify({
						user_id: userId.toString(),
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response.ok) {
				dispatch(
					updateQuestion({
						question_id: questionsItem.question_id,
						updates: {
							like: likeStatus,
							likeCount: updatedLikeCount,
						},
					})
				);
				setQuestionsItem((prev) => ({ ...prev, like: likeStatus, likeCount: updatedLikeCount }));
			} else {
				throw new Error('Failed to like the question');
			}
		} catch (error) {
			console.error('Error liking question:', error);
		} finally {
			setIsProcessing(false);
		}
	};

	// Функция для отправки запроса на репорт
	const handleReport = async () => {
		if (isProcessing) return;
		setIsProcessing(true);
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${questionsItem.question_id.toString()}/report`,
				{
					method: 'POST',
					body: JSON.stringify({
						user_id: userId.toString(),
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response.ok) {
				dispatch(
					updateQuestion({
						question_id: questionsItem.question_id,
						updates: { report: !questionsItem.report },
					})
				);
				setQuestionsItem((prev) => ({ ...prev, report: !prev.report }));
				setPopup(true);
				setPopupText('Your report has been successfully sent.');
				setPopupSource('report-page');
			} else {
				throw new Error('Failed to report the question');
			}
		} catch (error) {
			console.error('Error reporting question:', error);
		} finally {
			setIsProcessing(false);
		}
	};

	// Функция для отправки запроса на отслеживание вопроса
	const handleTrace = async () => {
		if (isProcessing) return;
		setIsProcessing(true);
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${questionsItem.question_id.toString()}/trace`,
				{
					method: 'POST',
					body: JSON.stringify({
						user_id: userId.toString(),
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response.ok) {
				dispatch(
					updateQuestion({
						question_id: questionsItem.question_id,
						updates: { trace: !questionsItem.trace },
					})
				);
				setQuestionsItem((prev) => ({ ...prev, trace: !prev.trace }));
			} else {
				throw new Error('Failed to trace the question');
			}
		} catch (error) {
			console.error('Error tracing question:', error);
		} finally {
			setIsProcessing(false);
		}
	};

	const commentsCount = 999;

	return (
		<li className='questions-page__item'>
			{comments === 'questions-page' && (
				<div
					className={`button questions-page__button questions-page__popular ${
						questionsItem.popular === false ? 'none' : ''
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
						className={`button questions-page__button questions-page__report ${
							questionsItem.report ? 'active' : ''
						}`}
						onClick={handleReport}
						disabled={questionsItem.report}
					>
						<ReportIcon />
					</button>
					<button
						type='button'
						className={`button questions-page__button questions-page__trace ${
							questionsItem.trace ? 'active' : ''
						}`}
						onClick={handleTrace}
					>
						<NotificationIcon />
					</button>
					<div className='questions-page__like-wrapper'>
						<button
							type='button'
							className={`button questions-page__button questions-page__like ${
								questionsItem.like ? 'active' : ''
							}`}
							onClick={handleLike}
						>
							<LikeIcon />
						</button>
						<span className='questions-page__like-count'>
							<CountUp start={startValue} end={endValue} duration={5} delay={0}>
								{({ countUpRef }) => (
									<div>
										<span ref={countUpRef} />
									</div>
								)}
							</CountUp>
						</span>
					</div>
				</div>
				{comments === 'questions-page' && (
					<div className='questions-page__wrapper'>
						{/* Обертка комментариев */}

						{/* Количесвто комментариев */}
						<span className='questions-page__comments-count'>{commentsCount}</span>

						{/* Кнопка комментариев */}
						<button
							type='button'
							className='button questions-page__button questions-page__button-comments questions-page__comments'
							onClick={() => {
								dispatch(setSelectedQuestionId(questionsItem.question_id));
								setPage('comments-page');
								setItem('');
							}}
						>
							{/* Иконка комментариев */}

							<CommentsIcon />
						</button>
					</div>
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
