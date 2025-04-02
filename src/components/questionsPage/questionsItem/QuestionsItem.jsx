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
	animationDelay,
}) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isProcessingLike, setIsProcessingLike] = useState(false);
	const [isProcessingTrace, setIsProcessingTrace] = useState(false);
	const [isProcessingReport, setIsProcessingReport] = useState(false);
	const selectedQuestion = useAppSelector(selectSelectedQuestion);
	const popupSource = useAppSelector(selectPopupSource);
	const [isVisible, setIsVisible] = useState(false);
	// Trigger visibility after the delay
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsVisible(true);
		}, animationDelay);

		return () => clearTimeout(timeoutId); // Cleanup timeout
	}, [animationDelay]);

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

	// Function to send a request for likes or dislikes
	const handleLike = async () => {
		if (isProcessingLike) return;

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
		setIsProcessingLike(true);

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
			setIsProcessingLike(false);
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
		if (isProcessingReport) {
			console.log('handleReport: isProcessing is already true. Exiting...');
			return;
		}

		console.log('handleReport: Setting isProcessing to true...');
		setIsProcessingTrace(true);

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
			setIsProcessingTrace(false); // Reset flag on error
			console.log('handleReport: isProcessing set to false in catch block.');
		} finally {
			console.log('handleReport: Finally block reached. Ensuring isProcessing is false...');
			setIsProcessingTrace(false);
		}
	};
	// Function for sending a request to track an issue
	const handleTrace = async () => {
		if (isProcessingTrace) return;

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
		setIsProcessingTrace(true);

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
			setIsProcessingTrace(false);
		}
	};

	const commentsCount = questionsItem.commentsCount;
	// Like counter animation
	const [startValueLike, setStartValueLike] = useState(0);
	const [endValueLike, setEndValueLike] = useState(questionItem.likeCount);

	useEffect(() => {
		if (startValueLike === 0 && endValueLike === 0) {
			setEndValueLike(questionItem.likeCount);
		} else {
			setStartValueLike(endValueLike);
			setEndValueLike(questionItem.likeCount);
		}
	}, [questionItem.likeCount]);

	// Comments counter animation
	const [commentsStartValue, setCommentsStartValue] = useState(0);
	const [commentsEndValue, setCommentsEndValue] = useState(questionItem.commentsCount);

	useEffect(() => {
		if (commentsStartValue === 0 && commentsEndValue === 0) {
			setCommentsEndValue(questionItem.commentsCount);
		} else {
			setCommentsStartValue(commentsEndValue);
			setCommentsEndValue(questionItem.commentsCount);
		}
	}, [questionItem.commentsCount]);

	const questionsItemDate = '18.01.2025'; ///////////

	return (
		// Questions page item
		<li
			className={`questions-page__item ${isVisible ? 'visible' : ''}`}
			style={{ transition: 'opacity 0.5s ease-in-out', opacity: isVisible ? 1 : 0 }}
		>
			{/* If questions page */}
			{comments === 'questions-page' && (
				// Popularity icon
				<div className={`button questions-page__popular`}>
					<StarIcon />
				</div>
			)}

			{/* Question title */}
			<h2 className='title questions-page__title'>{questionsItem.title}</h2>

			{/* Tags */}
			<ul className='tags'>
				{questionsItem.tags.map((tag, id) => (
					<li className='tags__item' key={id} id={id}>
						{tag}
					</li>
				))}
			</ul>

			{/* Wrapper for Question author, Date */}
			<div className='questions-page__user-wrapper'>
				{/* Question author */}
				<div className='user'>
					<ProfileIcon />
					<span className='user__name'>{questionsItem.user_name}</span>
				</div>

				{/* Questions item date */}
				<span>{questionsItemDate}</span>
			</div>

			{/* Wrapper for Report, Track, Likes, Comment and Leave Comment Buttons   */}
			<div className='questions-page__item-footer'>
				{/* Wrapper for Report, Tracking, Likes */}
				<div className='questions-page__buttons-wrapper'>
					{/* Report button */}
					<button
						type='button'
						className={`button questions-page__button ${questionsItem.report ? 'active' : ''}`}
						onClick={handleReport}
						disabled={questionsItem.report}
					>
						<ReportIcon />
					</button>

					{/* Tracking button */}
					<button
						type='button'
						className={`button questions-page__button ${questionsItem.trace ? 'active' : ''}`}
						onClick={handleTrace}
					>
						<NotificationIcon />
					</button>

					{/* Wrapper of the like and counter button */}
					<button type='button' className='icon-counter questions-page__likes' onClick={handleLike}>
						{/* Like button */}
						<div className={`button questions-page__button ${questionsItem.like ? 'active' : ''}`}>
							<LikeIcon />
						</div>

						{/* Likes counter */}
						<div className='icon-counter__counter icon-counter__counter-right counter-right'>
							<CountUp start={startValueLike} end={endValueLike} duration={2} delay={0}>
								{({ countUpRef }) => <span ref={countUpRef} />}
							</CountUp>
						</div>
					</button>
				</div>

				{/* If comments button */}
				{comments === 'questions-page' && (
					<button
						className='icon-counter questions-page__comments'
						type='button'
						onClick={() => {
							dispatch(setSelectedQuestionId(questionsItem.question_id));
							setPage('comments-page');
							setItem('');
						}}
					>
						{/* Comments count */}
						<span className='icon-counter__counter icon-counter__counter-left counter-left'>
							<CountUp start={commentsStartValue} end={commentsEndValue} duration={2} delay={0}>
								{({ countUpRef }) => <span ref={countUpRef} />}
							</CountUp>
						</span>

						{/* Comments button */}
						<div className='icon-counter__icon'>
							<CommentsIcon />
						</div>
					</button>
				)}

				{/* If leave a comment button */}
				{comments === 'comments-page' && !answer && (
					// Leave a comment button
					<button
						type='button'
						className='link questions-page__send-comment'
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
