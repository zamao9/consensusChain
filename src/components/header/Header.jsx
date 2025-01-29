import { useState } from 'react';
import { Logo, NotificationIcon, ProfileIcon } from '../../constants/SvgIcons';
import './header.sass';
import { useAppSelector } from '../../hooks/store';
import { selectUserBalance } from '../../feature/profile/profileSelector';
import CountUp from 'react-countup';

const Header = ({ curItem, setItem, setPage, setTab, currentBalance }) => {
	const userBalance = useAppSelector(selectUserBalance);

	return (
		<header className='header'>
			{/* Лого */}
			<div className='header__logo'>
				<Logo />
			</div>
			{/* Обертка Баланса, Уведомлений, Профиля */}
			<div className='header__profile'>
				{/* Баланс */}
				<div className='balance'>
					<span>
						<CountUp start={currentBalance} end={userBalance} duration={2} delay={0} suffix=' CT'>
							{({ countUpRef }) => (
								<div>
									<span ref={countUpRef} />
								</div>
							)}
						</CountUp>
					</span>
				</div>

				{/* Обертка Уведомлений, Профиля */}
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
							setTab('first');
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
