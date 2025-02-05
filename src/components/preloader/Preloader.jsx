import './preloader.sass';
import React, { useEffect } from 'react';
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

	return (
		<CSSTransition in={isVisible} timeout={300} classNames='fade' unmountOnExit>
			<div className='preloader' style={{ textAlign: 'center' }}>
				<ClipLoader color={color} size={size} />
				{message && <p style={{ color: color }}>{message}</p>}
			</div>
		</CSSTransition>
	);
};

export default Preloader;
