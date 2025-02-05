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
		hidden: { opacity: 0 }, // Начальное состояние (скрыто)
		visible: { opacity: 1 }, // Конечное состояние (видимо)
	};
	const [active, setActive] = useState(true); // активировать попап или нет
	const questionsItem = useAppSelector(selectSelectedQuestion);
	const questionId = questionsItem !== null ? questionsItem.question_id : '0';
	const [questionText, setQuestionText] = useState('');
	const popupText = useAppSelector(selectPopupText);
	console.log(popupText);

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
				setPopupSource('success'); // переключает попап на success
				setQuestionText('');
				dispatch(
					updateQuestion({
						question_id: questionsItem.question_id,
						updates: {
							answered: true,
						},
					})
				);

				// очищает текстовое поле
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
			{/* Задний фон Popup */}
			<motion.div
				className='popup-background'
				initial='hidden' // Начальное состояние
				animate={active === true ? 'visible' : ''} // Конечное состояние
				exit='hidden' // Состояние при выходе
				variants={variants}
				transition={{ duration: 0.2 }} // Время анимации
			>
				{/* Popup контэйнер для отступов по бокам */}
				<div className='popup-background__frame'>
					{/* Обертка контента */}
					<div className='popup-background__wrapper'>
						{/* Кнопка закрытия Popup */}
						<button
							type='button'
							className='popup-background__close'
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
								{/* Иконка */}
								<div className='popup-background__svg popup-background__success mb--10'>
									<SuccessIcon />
								</div>

								{/* Текст */}
								<p className='lh--140 popup-background__text'>{popupText}</p>
							</>
						)}

						{/* Popup ERROR */}
						{popupSource === 'error' && (
							<>
								{/* Иконка */}
								<div className='popup-background__svg popup-background__error mb--10'>
									<CloseIcon />
								</div>

								{/* Текст */}
								<p className='lh--140 popup-background__text'>{popupText}</p>
							</>
						)}

						{/* Popup NOTIFICATIONS */}
						{popupSource === 'notifications-page' && (
							<>
								{/* Иконка */}
								<div className='popup-background__svg popup-background__notifications-svg mb--16 '>
									{popupSvg}
								</div>

								{/* Разделительная линия */}
								<hr className='mb--22' />

								{/* Текст */}
								<p className='lh--140 popup-background__text'>{popupText}</p>
							</>
						)}

						{/* Popup COMMENTS */}
						{popupSource === 'answer' && (
							<>
								{/* Заголовок */}
								<h2 className='title mb--16 lh--140 popup-background__title'>Your answer</h2>

								{/* Разделительная линия */}
								<hr className='mb--16' />

								{/* Текстареа */}
								<textarea
									placeholder='. . .'
									className='text mb--16 lh--140 popup-background__textarea'
									value={questionText}
									onChange={(e) => setQuestionText(e.target.value)}
									required
								/>

								{/* Кнопка отправки */}
								<button type='submit' className='button' onClick={handleCommentSubmit}>
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
