import { useState } from 'react';
import { ProfileIcon } from '../../constants/SvgIcons';
import './header.sass';

const Header = ({ curItem, setItem, setPage }) => {
	return (
		<header className='header'>
			<div className='header__profile'>
				<div className='balance'>
					<span>293 TON</span>
				</div>
				<div className='profile'>
					<button
						className={`profile__button ${curItem === 'profile-page' ? 'active' : ''}`}
						onClick={() => {
							setItem('profile-page');
							setPage('profile-page');
						}}
					>
						<ProfileIcon />
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
