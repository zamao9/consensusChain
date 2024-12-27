import { useState } from 'react';
import { NotificationIcon, ProfileIcon } from '../../constants/SvgIcons';
import './header.sass';

const Header = ({ curItem, setItem, setPage }) => {
	return (
		<header className='header'>
			<div className='header__profile'>
				<div className='balance'>
					<span>999 TON</span>
				</div>
				<div className='header__buttons'>
					<button
						className={`header__button header-item1 ${
							curItem === 'notifications-page' ? 'active' : ''
						}`}
						onClick={() => {
							setItem('notifications-page');
							setPage('notifications-page');
						}}
					>
						<NotificationIcon />
					</button>
					<button
						className={`header__button header-item2 ${curItem === 'profile-page' ? 'active' : ''}`}
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
