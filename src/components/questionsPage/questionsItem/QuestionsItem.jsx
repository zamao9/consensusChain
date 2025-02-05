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
import { selectPopupSource } from '../../../feature/userInterface/userIntarfaceSelector';

const QuestionsItem = ({
	questionItem,
	comments,
	setPopup,
	setPopupText,
	setPopupSource,
	setPage,
	setItem,
	isCurrentElement,
}) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isProcessing, setIsProcessing] = useState(false);
	const selectedQuestion = useAppSelector(selectSelectedQuestion);
	const popupSource = useAppSelector(selectPopupSource);

	//console.log(popupSource)

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

	const answer = questionsItem.answered;

	const [startValue, setStartValue] = useState(0);
	const [endValue, setEndValue] = useState(questionsItem.likeCount);
	//console.log('startValue = ', startValue, ' endValue = ', endValue);

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

		// Определяем новое состояние лайка
		const likeStatus = !questionsItem.like;
		const updatedLikeCount = likeStatus ? questionsItem.likeCount + 1 : questionsItem.likeCount - 1;

		// Сразу обновляем состояние клиента
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

		// Устанавливаем флаг обработки
		setIsProcessing(true);

		try {
			// Отправляем запрос на сервер
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

			// Если сервер вернул ошибку, возвращаем предыдущее состояние
			if (!response.ok) {
				throw new Error('Failed to like the question');
			}
		} catch (error) {
			console.error('Error liking question:', error);

			// Откатываем изменения в состоянии клиента
			const revertedLikeStatus = !likeStatus;
			const revertedLikeCount = revertedLikeStatus
				? questionsItem.likeCount + 1
				: questionsItem.likeCount - 1;

			dispatch(
				updateQuestion({
					question_id: questionsItem.question_id,
					updates: {
						like: revertedLikeStatus,
						likeCount: revertedLikeCount,
					},
				})
			);
			setQuestionsItem((prev) => ({
				...prev,
				like: revertedLikeStatus,
				likeCount: revertedLikeCount,
			}));

			// Показываем сообщение об ошибке
			setPopup(true);
			setPopupText('An error occurred while processing your like. Please try again.');
			setPopupSource('error');
		} finally {
			// Снимаем флаг обработки
			setIsProcessing(false);
		}
	};

	const [resolvePromise, setResolvePromise] = useState(null); // Для управления Promise
	const [rejectPromise, setRejectPromise] = useState(null);

	useEffect(() => {
		console.log('useEffect: popupSource changed to:', popupSource);

		// Если есть активный Promise и popupSource изменился, завершаем его
		if (resolvePromise && popupSource === 'success') {
			console.log('useEffect: Resolving promise because popupSource is "success".');
			resolvePromise();
			setResolvePromise(null);
			setRejectPromise(null);
		} else if (rejectPromise && popupSource === 'cancel') {
			console.log('useEffect: Rejecting promise because popupSource is "cancel".');
			rejectPromise(new Error('Report canceled'));
			setResolvePromise(null);
			setRejectPromise(null);
		}
	}, [popupSource, resolvePromise, rejectPromise]);

	const handleReport = async () => {
		if (isProcessing) {
			console.log('handleReport: isProcessing is already true. Exiting...');
			return;
		}

		console.log('handleReport: Setting isProcessing to true...');
		setIsProcessing(true);

		try {
			console.log('handleReport: Showing popup and setting popupSource to "report-page"');
			dispatch(setPopup(true));
			dispatch(setPopupText('')); // Очищаем текст ошибки
			dispatch(setPopupSource('report-page'));

			console.log('handleReport: Waiting for popupSource confirmation...');
			await new Promise((resolve, reject) => {
				setResolvePromise(() => resolve);
				setRejectPromise(() => reject);
			});

			console.log('handleReport: Sending request to the server...');
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

			if (!response.ok) {
				console.log('handleReport: Server returned an error. Throwing exception...');
				throw new Error('Failed to report the question');
			}

			console.log('handleReport: Updating client state...');
			dispatch(
				updateQuestion({
					question_id: questionsItem.question_id,
					updates: { report: true },
				})
			);
			setQuestionsItem({ ...questionsItem, report: true });

			console.log('handleReport: Setting success message...');
		} catch (error) {
			console.error('handleReport: Error occurred:', error.message);

			if (error.message === 'Report canceled') {
				console.log('handleReport: Report was canceled. Setting cancel message...');
				dispatch(setPopupText('Report canceled.'));
			} else {
				console.log('handleReport: Setting error message...');
				dispatch(setPopupText('An error occurred while processing your report. Please try again.'));
			}

			dispatch(setPopupSource('error'));
			setIsProcessing(false); // Сбрасываем флаг при ошибке
			console.log('handleReport: isProcessing set to false in catch block.');
		} finally {
			console.log('handleReport: Finally block reached. Ensuring isProcessing is false...');
			setIsProcessing(false);
		}
	};
	// Функция для отправки запроса на отслеживание вопроса
	const handleTrace = async () => {
		if (isProcessing) return;

		// Определяем новое состояние отслеживания
		const traceStatus = !questionsItem.trace;

		// Сразу обновляем состояние клиента
		dispatch(
			updateQuestion({
				question_id: questionsItem.question_id,
				updates: { trace: traceStatus },
			})
		);
		setQuestionsItem((prev) => ({ ...prev, trace: traceStatus }));

		// Устанавливаем флаг обработки
		setIsProcessing(true);

		try {
			// Отправляем запрос на сервер
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

			// Если сервер вернул ошибку, возвращаем предыдущее состояние
			if (!response.ok) {
				throw new Error('Failed to trace the question');
			}
		} catch (error) {
			console.error('Error tracing question:', error);

			// Откатываем изменения в состоянии клиента
			dispatch(
				updateQuestion({
					question_id: questionsItem.question_id,
					updates: { trace: !traceStatus },
				})
			);
			setQuestionsItem((prev) => ({ ...prev, trace: !traceStatus }));

			// Показываем сообщение об ошибке
			setPopup(true);
			setPopupText('An error occurred while processing your trace request. Please try again.');
			setPopupSource('error');
		} finally {
			// Снимаем флаг обработки
			setIsProcessing(false);
		}
	};

	const commentsCount = questionsItem.commentsCount;

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

			{/* Автор вопроса */}
			<div className='user questions-page__user'>
				<ProfileIcon />
				<span className='user__name'>{questionsItem.user_name}</span>
			</div>
			<div className='questions-page__buttons-wrapper'>
				<div className='questions-page__buttons'>
					{/* Кнопка репорта */}
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

					{/* Кнопка отслеживания */}
					<button
						type='button'
						className={`button questions-page__button questions-page__trace ${
							questionsItem.trace ? 'active' : ''
						}`}
						onClick={handleTrace}
					>
						<NotificationIcon />
					</button>

					{/* Обертка кнопки лайка и счетчика */}
					<div className='questions-page__like-wrapper'>
						{/* Кнопка лайка */}
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

				{/* Кнопка комментариев */}
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

				{/* Кнопка оставить комментарий */}
				{comments === 'comments-page' && !answer && (
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
