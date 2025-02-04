import './header.sass';
import { useState, useEffect } from 'react';
import { Logo, NotificationIcon, ProfileIcon } from '../../constants/SvgIcons';
import CountUp from 'react-countup';
import { useAppSelector } from '../../hooks/store';
import { selectUserBalance } from '../../feature/profile/profileSelector';

const Header = ({ curItem, setItem, setPage, setTab }) => {
	const userBalance = useAppSelector(selectUserBalance); // Получаем значение баланса через селектор
	const [startValue, setStartValue] = useState(0);
	const [endValue, setEndValue] = useState(userBalance);

	useEffect(() => {
		if (startValue === 0 && endValue === 0) {
			// Первый рендер: анимация начинается с 0 до текущего значения userBalance
			setEndValue(userBalance);
		} else {
			// Последующие обновления: анимация от предыдущего значения до нового
			setStartValue(endValue);
			setEndValue(userBalance);
		}
	}, [userBalance]);

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
						<CountUp start={startValue} end={endValue} duration={2} delay={0} suffix=' CT'>
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
					{/* Кнопка уведомлений */}
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

					{/* Кнопка профиля */}
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
