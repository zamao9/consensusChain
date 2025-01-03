import { useState } from 'react';
import './profilePage.sass';
import {
	ArrowRightIcon,
	ProfileIcon,
	SettingsIcon,
	SuccessIcon,
	SupportIcon,
} from '../../constants/SvgIcons';

const ProfilePage = ({ tab, setTab, setPage, setItem }) => {
	// Структура Линков
	const linksData = [
		{
			key: 1,
			svg: <SupportIcon />,
			handler: () => {
				console.log('support-page');
			},
		},
	];

	// Структура Статистики
	const statsData = [
		{
			key: 1,
			name: 'Rating:',
			count: 12013,
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Rating');
			},
		},
		{
			key: 2,
			name: 'Likes:',
			count: 105,
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Likes');
			},
		},
		{
			key: 3,
			name: 'Questions:',
			count: 301,
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Questions');
			},
		},
		{
			key: 4,
			name: 'Responses received:',
			count: 109,
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Responses received');
			},
		},
		{
			key: 5,
			name: 'Replies sent:',
			count: 205,
			svg: <ArrowRightIcon />,
			handler: () => {
				setPage('replies-sent-page');
				setItem('');
			},
		},
	];

	// Структура Ачивок
	const achievementsData = [
		{
			key: 1,
			title: 'Bla bla bla',
			text: 'Submit more than 3 questions.',
			icon: <SuccessIcon />,
			done: true,
		},
		{
			key: 2,
			title: 'Bla bla bla 2',
			text: 'Submit more than 10 questions.',
			icon: <SuccessIcon />,
			done: false,
		},
		{
			key: 3,
			title: 'Bla bla bla 3',
			text: 'Submit more than 20 questions.',
			icon: <SuccessIcon />,
			done: false,
		},
	];

	return (
		<div className='profile-page'>
			{/* Табы */}
			<ul className='tabs mb--32'>
				<li>
					<button
						className={`button tabs__item ${tab === 'first' ? 'active' : ''}`}
						onClick={() => setTab('first')}
					>
						Account
					</button>
				</li>
				<li>
					<button
						className={`button tabs__item ${tab === 'second' ? 'active' : ''}`}
						onClick={() => setTab('second')}
					>
						Achievements
					</button>
				</li>
			</ul>

			{/* Если Таб Account отображать */}
			{tab === 'first' && (
				<>
					{/* Обертка Никнейма, Даты регистрации */}
					<div className='user mb--16'>
						{/* Никнейм */}
						<div className='user__name'>
							<ProfileIcon />
							<span className='title fw--400 user__title'>gugugaga</span>
						</div>

						{/* Дата регистрации */}
						<div>
							Registered: <span>12.01.2025</span>
						</div>
					</div>

					{/* Обертка Поддержки, ... */}
					<ul className='links mb--16'>
						{/* Линки */}
						{linksData.map((element) => (
							<li className='links__item' key={element.key}>
								<button className='links__button' onClick={element.handler}>
									{element.svg}
								</button>
							</li>
						))}
					</ul>

					{/* Обертка статистики */}
					<div className='stats'>
						{/* Список статистики */}
						<ul className='stats__list'>
							{/* Элементы списка статистики */}
							{statsData.map((element) => (
								<li className='stats__item' key={element.key}>
									{/* Данные элементов статистики */}
									<div className='stats__data'>
										<span className='stats__name'>{element.name}</span>
										<span className='stats__count'>{element.count}</span>
									</div>

									{/* Линк элементов статистики */}
									<button className='stats__button' onClick={element.handler}>
										{element.svg}
									</button>
								</li>
							))}
						</ul>
					</div>
				</>
			)}

			{/* Если Таб Achievements */}
			{tab === 'second' && (
				<>
					{/* Список Ачивок */}
					<ul className='achievements'>
						{/* Элемент списка Ачивок */}
						{achievementsData.map((element) => (
							<li
								className={`achievements__item ${element.done === true ? 'done' : ''}`}
								key={element.key}
							>
								{/* Контент элемента*/}
								<div className='achievements__content'>
									<h2 className='title lh--140 achievements__title'>{element.title}</h2>
									<p className='lh--140 achievements__text'>{element.text}</p>
								</div>

								{/* Иконка выполненой ачивки */}
								{element.done === true && <div className='achievements__icon'>{element.icon}</div>}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
};

export default ProfilePage;
