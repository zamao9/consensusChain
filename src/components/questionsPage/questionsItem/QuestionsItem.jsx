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

	// Update the local state when a question or flag changes isCurrentElement
	useEffect(() => {
		if (isCurrentElement) {
			setQuestionsItem(selectedQuestion); // Updating the current issue
		} else {
			setQuestionsItem(questionItem); // Let's use the transmitted question
		}
	}, [isCurrentElement, selectedQuestion, questionItem]);

	const [questionsItem, setQuestionsItem] = useState(
		isCurrentElement ? selectedQuestion : questionItem
	);

	const answer = questionsItem.answered;

	const [startValue, setStartValue] = useState(0);
	const [endValue, setEndValue] = useState(questionsItem.likeCount);

	useEffect(() => {
		if (startValue === 0 && endValue === 0) {
			// First render: animation starts from 0 to the current userBalance value
			setEndValue(questionsItem.likeCount);
		} else {
			// Subsequent updates: animation from the previous value to the new value
			setStartValue(endValue);
			setEndValue(questionsItem.likeCount);
		}
	}, [questionsItem.likeCount]);

	// Function to send a request for likes or dislikes
	const handleLike = async () => {
		if (isProcessing) return;

		// Determining the new condition of the husky
		const likeStatus = !questionsItem.like;
		const updatedLikeCount = likeStatus ? questionsItem.likeCount + 1 : questionsItem.likeCount - 1;

		// Immediately update the state of the client
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

		// Set the processing flag
		setIsProcessing(true);

		try {
			// Send the request to the server
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

			// If the server returned an error, return the previous state
			if (!response.ok) {
				throw new Error('Failed to like the question');
			}
		} catch (error) {
			console.error('Error liking question:', error);

			// Roll back changes to the client state
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

			// Show error message
			setPopup(true);
			setPopupText('An error occurred while processing your like. Please try again.');
			setPopupSource('error');
		} finally {
			// Clearing the processing flag
			setIsProcessing(false);
		}
	};

	const [resolvePromise, setResolvePromise] = useState(null); // To control Promise
	const [rejectPromise, setRejectPromise] = useState(null);

	useEffect(() => {
		// If there is an active Promise and the popupSource has changed, terminate it
		if (resolvePromise && popupSource === 'success') {
			console.log('useEffect: Resolving promise because popupSource is "success".');
			resolvePromise();
			setResolvePromise(null);
			setRejectPromise(null);
		} else if (rejectPromise && popupSource === 'cancel') {
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
			dispatch(setPopupText('')); // Clearing the error text
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
			setIsProcessing(false); // Reset flag on error
			console.log('handleReport: isProcessing set to false in catch block.');
		} finally {
			console.log('handleReport: Finally block reached. Ensuring isProcessing is false...');
			setIsProcessing(false);
		}
	};
	// Function for sending a request to track an issue
	const handleTrace = async () => {
		if (isProcessing) return;

		// Defining the new tracking state
		const traceStatus = !questionsItem.trace;

		// Immediately update the state of the client
		dispatch(
			updateQuestion({
				question_id: questionsItem.question_id,
				updates: { trace: traceStatus },
			})
		);
		setQuestionsItem((prev) => ({ ...prev, trace: traceStatus }));

		// Set the processing flag
		setIsProcessing(true);

		try {
			// Send the request to the server
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

			// If the server returned an error, return the previous state
			if (!response.ok) {
				throw new Error('Failed to trace the question');
			}
		} catch (error) {
			console.error('Error tracing question:', error);

			// Roll back changes to the client state
			dispatch(
				updateQuestion({
					question_id: questionsItem.question_id,
					updates: { trace: !traceStatus },
				})
			);
			setQuestionsItem((prev) => ({ ...prev, trace: !traceStatus }));

			// Show error message
			setPopup(true);
			setPopupText('An error occurred while processing your trace request. Please try again.');
			setPopupSource('error');
		} finally {
			// Clearing the processing flag
			setIsProcessing(false);
		}
	};

	const commentsCount = questionsItem.commentsCount;

	return (
		// Questions item
		<li className='questions-page__item'>
			{/* If questions page */}
			{comments === 'questions-page' && (
				// Popularity icon
				<div
					className={`button questions-page__button questions-page__popular ${
						questionsItem.popular === false ? 'none' : ''
					}`}
				>
					<StarIcon />
				</div>
			)}

			{/* Question title */}
			<h2 className='title lh--140 questions-page__title'>{questionsItem.title}</h2>

			{/* Tags */}
			<ul className='tags'>
				{questionsItem.tags.map((tag, id) => (
					<li className='tags__item' key={id} id={id}>
						{tag}
					</li>
				))}
			</ul>

			{/* Question author */}
			<div className='user questions-page__user'>
				<ProfileIcon />
				<span className='user__name'>{questionsItem.user_name}</span>
			</div>

			{/* Wrapper for Report, Track, Like, Comment and Leave Comment Buttons   */}
			<div className='questions-page__buttons-wrapper'>
				{/* Wrapper for Report, Tracking, Likes */}
				<div className='questions-page__buttons'>
					{/* Report button */}
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

					{/* Tracking button */}
					<button
						type='button'
						className={`button questions-page__button questions-page__trace ${
							questionsItem.trace ? 'active' : ''
						}`}
						onClick={handleTrace}
					>
						<NotificationIcon />
					</button>

					{/* Wrapper of the like and counter button */}
					<div className='questions-page__like-wrapper'>
						{/* Like button */}
						<button
							type='button'
							className={`button questions-page__button questions-page__like ${
								questionsItem.like ? 'active' : ''
							}`}
							onClick={handleLike}
						>
							<LikeIcon />
						</button>

						{/* Likes counter */}
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

				{/* If comments button */}
				{comments === 'questions-page' && (
					// Comment Wrapper
					<div className='questions-page__wrapper'>
						{/* Comments count */}
						<span className='questions-page__comments-count'>{commentsCount}</span>

						{/* Comments button */}
						<button
							type='button'
							className='button questions-page__button questions-page__button-comments questions-page__comments'
							onClick={() => {
								dispatch(setSelectedQuestionId(questionsItem.question_id));
								setPage('comments-page');
								setItem('');
							}}
						>
							<CommentsIcon />
						</button>
					</div>
				)}

				{/* If leave a comment button */}
				{comments === 'comments-page' && !answer && (
					// Leave a comment button
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
