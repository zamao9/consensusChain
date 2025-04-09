import './popupBackground.sass';
import ReportPopup from '../reportPopup/ReportPopup';
import { CloseIcon, SuccessIcon } from '../../constants/SvgIcons';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectUserId } from '../../feature/profile/profileSelector';
import { selectSelectedQuestion } from '../../feature/questions/questionsSelector';
import { updateQuestion } from '../../feature/questions/questionsSlice';
import { selectPopupText } from '../../feature/userInterface/userIntarfaceSelector';

const PopupBackground = ({ setPopup, popupSvg, popupSource, setPopupSource, setPopupText }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const variants = {
		hidden: { opacity: 0 }, // Initial state (hidden)
		visible: { opacity: 1 }, // End state (apparently)
	};
	const [active, setActive] = useState(true); // whether or not to activate the popup
	const questionsItem = useAppSelector(selectSelectedQuestion);
	const questionId = questionsItem !== null ? questionsItem.question_id : '0';
	const [questionText, setQuestionText] = useState('');
	const popupText = useAppSelector(selectPopupText);

	const handleCommentSubmit = async () => {
		if (!questionText.trim()) {
			setPopup(true);
			setPopupText('Your answer cannot be empty. Please enter some text before submitting.');
			setPopupSource('error');
			return;
		}

		const payload = {
			user_id: userId.toString(),
			text: questionText,
		};
		const strQuestionId = questionId.toString();
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${strQuestionId}/comments`,
				{
					method: 'POST',
					body: JSON.stringify(payload),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				setPopup(true);
				setPopupText(
					'Your answer has been successfully submitted. It may take up to 24 hours to review your response. You will receive a notification once the review process is complete.'
				);
				setPopupSource('success'); // switches the popup to success
				setQuestionText('');
				dispatch(
					updateQuestion({
						question_id: questionsItem.question_id,
						updates: {
							answered: true,
						},
					})
				);

				// clears the text field
			} else {
				throw new Error('Failed to submit the answer.');
			}
		} catch (error) {
			console.log(error);
			setPopup(true);
			setPopupText('An error occurred while submitting your answer. Please try again later.');
			setPopupSource('error');
		}
	};

	return (
		<AnimatePresence>
			{/* Background Popup */}
			<motion.div
				className='popup-background'
				initial='hidden' // Initial state
				animate={active === true ? 'visible' : ''} // End state
				exit='hidden' // Exit status
				variants={variants}
				transition={{ duration: 0.2 }} // Animation time
			>
				{/* Popup container for side padding */}
				<div className='popup-background__frame'>
					{/* Content Wrapper */}
					<div className='popup-background__wrapper'>
						{/* Popup close button */}
						<button
							type='button'
							className='link popup-background__close'
							onClick={() => {
								setPopup(false);
								setPopupSource('cancel');
							}}
						>
							<CloseIcon />
						</button>

						{/* Popup SUCCESS */}
						{popupSource === 'success' && (
							<>
								{/* Icon */}
								<div className='popup-svg popup-svg__success mb--22'>
									<SuccessIcon />
								</div>

								{/* Dividing line */}
								<hr className='mb--22' />

								{/* Text */}
								<p className='ta--c'>{popupText}</p>
							</>
						)}

						{/* Popup ERROR */}
						{popupSource === 'error' && (
							<>
								{/* Icon */}
								<div className='popup-svg popup-svgd__error mb--22'>
									<CloseIcon />
								</div>

								{/* Dividing line */}
								<hr className='mb--22' />

								{/* Text */}
								<p className='ta--c'>{popupText}</p>
							</>
						)}

						{/* Popup NOTIFICATIONS */}
						{popupSource === 'notifications-page' && (
							<>
								{/* Icon */}
								<div className='popup-svg popup-svg__notifications-svg mb--22'>{popupSvg}</div>

								{/* Dividing line */}
								<hr className='mb--22' />

								{/* Text */}
								<p className='ta--c'>{popupText}</p>
							</>
						)}

						{/* Popup COMMENTS */}
						{popupSource === 'answer' && (
							<>
								{/* Title */}
								<h2 className='title mb--22'>Your answer</h2>

								{/* Dividing line */}
								<hr className='mb--22' />

								{/* Textarea */}
								<textarea
									placeholder='. . .'
									className='mb--16'
									value={questionText}
									onChange={(e) => setQuestionText(e.target.value)}
									required
								/>

								{/* Submit button */}
								<button type='submit' className='submit-button' onClick={handleCommentSubmit}>
									Submit
								</button>
							</>
						)}

						{/* Popup REPORT */}
						{popupSource === 'report-page' && <ReportPopup setPopupSource={setPopupSource} />}
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default PopupBackground;
