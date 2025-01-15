import { useState } from 'react';
import './profilePage.sass';
import {
	ArrowRightIcon,
	ProfileIcon,
	SettingsIcon,
	SuccessIcon,
	SupportIcon,
} from '../../constants/SvgIcons';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import {
	selectAnswersCount,
	selectLikesReceived,
	selectQuestionsCount,
	selectReceivedAnswersCount,
	selectRegistrationDate,
	selectUserName,
	selectUserRating,
} from '../../feature/profile/profileSelector';
import { incrementRating, setName, setRating } from '../../feature/profile/profileSlice';
import {
	selectAchievements,
	selectAchievementsWithProgress,
} from '../../feature/achievements/achievementsSelector';

const ProfilePage = ({ tab, setTab, setPage, setItem }) => {
	const dispatch = useAppDispatch();
	const profileName = useAppSelector(selectUserName);
	const profileRegistrationDate = useAppSelector(selectRegistrationDate);
	const achievementsData = useAppSelector(selectAchievementsWithProgress);

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
			count: useAppSelector(selectUserRating),
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Rating');
				dispatch(incrementRating(1));
			},
		},
		{
			key: 2,
			name: 'Likes:',
			count: useAppSelector(selectLikesReceived),
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Likes');
			},
		},
		{
			key: 3,
			name: 'Questions:',
			count: useAppSelector(selectQuestionsCount),
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Questions');
			},
		},
		{
			key: 4,
			name: 'Responses received:',
			count: useAppSelector(selectReceivedAnswersCount),
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Responses received');
			},
		},
		{
			key: 5,
			name: 'Replies sent:',
			count: useAppSelector(selectAnswersCount),
			svg: <ArrowRightIcon />,
			handler: () => {
				setPage('replies-sent-page');
				setItem('');
			},
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
							<span className='title fw--400 user__title'>{profileName}</span>
						</div>

						{/* Дата регистрации */}
						<div>
							Registered: <span>{profileRegistrationDate}</span>
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
								key={element.id}
							>
								{/* Контент элемента*/}
								<div className='achievements__content'>
									<h2 className='title lh--140 achievements__title'>{element.title}</h2>
									<p className='lh--140 achievements__text'>{element.text}</p>
								</div>

								{/* Иконка выполненой ачивки */}
								{element.done === true && (
									<div className='achievements__icon'>
										<SuccessIcon />
									</div>
								)}
								{element.done !== true && (
									<div className='achievements__progress'>
										{element.progress + ' / ' + element.goal}
									</div>
								)}
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
};

export default ProfilePage;
