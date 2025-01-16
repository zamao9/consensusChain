import React from 'react';
import { CSSTransition } from 'react-transition-group';
import ClipLoader from 'react-spinners/ClipLoader';
import './preloader.sass';

const Preloader = ({ isVisible, color = '#CECECE', size = 60, message = 'Loading...' }) => {
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
