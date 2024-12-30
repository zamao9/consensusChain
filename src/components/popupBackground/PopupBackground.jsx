import './popupBackground.sass';
import ReportPopup from '../reportPopup/ReportPopup';
import { CloseIcon, SuccessIcon } from '../../constants/SvgIcons';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/store';
import { addComment } from '../../feature/comments/commentsSlice';

const PopupBackground = ({
	setPopup,
	popupSvg,
	popupText,
	popupSource,
	setPopupSource,
	setAnswer,
	questionsItem,
}) => {
	const variants = {
		hidden: { opacity: 0 }, // Начальное состояние (скрыто)
		visible: { opacity: 1 }, // Конечное состояние (видимо)
	};
	const [active, setActive] = useState(true); // активировать попап или нет

	const dispatch = useAppDispatch();
	const questionId = questionsItem !== null ? questionsItem.id : '0';
	const questionText = 'fsasfasfasafsf';

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
				{/* Блок Popup */}
				<div className='popup-background__wrapper'>
					{/* Кнопка закрытия Popup */}
					<button type='button' className='popup-background__close' onClick={() => setPopup(false)}>
						<CloseIcon />
					</button>
					{/* Иконка и Текст если popup success */}
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

					{/* Иконка и Текст если popup error */}
					{popupSource === 'error' && (
						<>
							{/* Иконка */}
							<div className='popup-background__svg popup-background__error mb--10'>
								<SuccessIcon />
							</div>
							{/* Текст */}
							<p className='lh--140 popup-background__text'>{popupText}</p>
						</>
					)}
					{/* Иконка и Текст если popup notifications */}
					{popupSource === 'notifications-page' && (
						<>
							{/* Иконка */}
							<div className='popup-background__svg popup-background__notifications-svg mb--16 '>
								{popupSvg}
							</div>

							{/* Разделительная линия */}
							<hr className='mb--22' />

							<p className='lh--140 popup-background__text'>{popupText}</p>
						</>
					)}
					{/* Заголовок, Текстареа, Кнопка если popup comments */}
					{popupSource === 'answer' && (
						<>
							{/* Заголовок */}
							<h2 className='title mb--16 lh--140 popup-background__title'>Your answer</h2>

							{/* Разделительная линия */}
							<hr className='mb--16' />

							{/* Текстареа */}
							<textarea
								placeholder='. . .'
								className='text mb--16 lh--140 popup-background__textarea '
								required
							/>
							<button
								type='submit'
								className='button'
								onClick={() => {
									dispatch(addComment({ questionId, questionText }));
									setPopupSource('success'); // меняет popup на success
									setAnswer(true);
								}}
							>
								Submit
							</button>
						</>
					)}
					{/* Открыть Report Popup  */}
					{popupSource === 'report-page' && (
						<ReportPopup setPopup={setPopup} setPopupSource={setPopupSource} />
					)}
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default PopupBackground;
