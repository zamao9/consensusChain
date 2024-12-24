import './popupBackground.sass';
import ReportPopup from '../reportPopup/ReportPopup';
import { CloseIcon } from '../../constants/SvgIcons';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const PopupBackground = ({ setPopup }) => {
	const variants = {
		hidden: { opacity: 0 }, // Начальное состояние (скрыто)
		visible: { opacity: 1 }, // Конечное состояние (видимо)
	};
	const [active, setActive] = useState(true); // активировать попап или нет

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

					{/* Открыть Report Popup  */}
					<ReportPopup setPopup={setPopup} />
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default PopupBackground;
