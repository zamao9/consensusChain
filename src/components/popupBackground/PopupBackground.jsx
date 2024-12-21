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
			<motion.div
				className='popup-background'
				initial='hidden' // Начальное состояние
				animate={active === true ? 'visible' : ''} // Конечное состояние
				exit='hidden' // Состояние при выходе
				variants={variants}
				transition={{ duration: 0.2 }} // Время анимации
			>
				<div className='popup-background__wrapper'>
					<button type='button' className='popup-background__close' onClick={() => setPopup(false)}>
						<CloseIcon />
					</button>
					<ReportPopup />
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default PopupBackground;
