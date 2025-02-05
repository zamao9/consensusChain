import './header.sass';
import { useState, useEffect } from 'react';
import { Logo, NotificationIcon, ProfileIcon } from '../../constants/SvgIcons';
import CountUp from 'react-countup';
import { useAppSelector } from '../../hooks/store';
import { selectUserBalance } from '../../feature/profile/profileSelector';

const Header = ({ curItem, setItem, setPage, setTab }) => {
	// get balance by selector
	const userBalance = useAppSelector(selectUserBalance);
	const [startValue, setStartValue] = useState(0);
	const [endValue, setEndValue] = useState(userBalance);

	useEffect(() => {
		if (startValue === 0 && endValue === 0) {
			// First render: animation begin from 0 to current  текущего value userBalance
			setEndValue(userBalance);
		} else {
			// Subsequent updates: animation from the previous value to the new value
			setStartValue(endValue);
			setEndValue(userBalance);
		}
	}, [userBalance]);

	return (
		<header className='header'>
			{/* Logo */}
			<div className='header__logo'>
				<Logo />
			</div>
			{/*  Wrapper for Balance, Notifications, Profile */}
			<div className='header__profile'>
				{/* Balance */}
				<div className='balance'>
					<span>
						<CountUp start={startValue} end={endValue} duration={2} delay={0} suffix=' CT'>
							{({ countUpRef }) => (
								<div>
									<span ref={countUpRef} />
								</div>
							)}
						</CountUp>
					</span>
				</div>

				{/* Wrapper for Notifications, Profile */}
				<div className='header__buttons'>
					{/* Button for Notifications */}
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

					{/* Button for Profile */}
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
