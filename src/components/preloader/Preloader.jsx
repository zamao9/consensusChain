import './preloader.sass';
import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import ClipLoader from 'react-spinners/ClipLoader';

const Preloader = ({ isVisible, color = '#CECECE', size = 60, message = 'Loading...' }) => {
	// Lock the scroll when mounting and unlock when unmounting
	useEffect(() => {
		if (isVisible) {
			document.body.classList.add('no-scroll'); // Blocking the scroll
		}
		return () => {
			document.body.classList.remove('no-scroll'); // Unlocking the scroll
		};
	}, [isVisible]);

	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsActive(!isActive);
		}, 1000);
	}, [isActive]);

	return (
		<CSSTransition in={isVisible} timeout={300} classNames='fade' unmountOnExit>
			<div className='preloader' style={{ textAlign: 'center' }}>
				<svg
					className='preloader-svg'
					viewBox='0 0 59 23'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M26.3043 11.6667C26.3043 21.3846 26.3043 21.3846 41.812 21.3846C57.3196 21.3846 57.3077 21.3846 57.3077 11.718C57.3077 2.00003 57.3196 2.00004 41.812 2.00003C39.5632 2.00003 37.6405 2.05112 35.9966 2.1607'
						stroke='#CECECE'
						strokeWidth='3'
						strokeLinecap='round'
						className={`svg-elem-1 ${isActive ? 'active' : ''}`}
					></path>
					<path
						d='M33.0273 11.718C33.0273 2.00003 33.0274 2.00004 17.5197 2.00003C2.01197 2.00003 2 1.97439 2 11.6923C2 21.4103 2 21.3846 16.5504 21.3846C18.7992 21.3846 21.6912 21.3336 23.335 21.224'
						stroke='#66643E'
						strokeWidth='3'
						strokeLinecap='round'
						className={`svg-elem-2 ${isActive ? 'active' : ''}`}
					></path>
				</svg>
				{message && <p style={{ color: color }}>{message}</p>}
			</div>
		</CSSTransition>
	);
};

export default Preloader;
