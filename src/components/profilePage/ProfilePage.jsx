import './profilePage.sass';
import { ArrowRightIcon, ProfileIcon, SuccessIcon, SupportIcon } from '../../constants/SvgIcons';
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
import { selectAchievementsWithProgress } from '../../feature/achievements/achievementsSelector';

const ProfilePage = ({ tab, setTab, setPage, setItem }) => {
	const dispatch = useAppDispatch();
	const profileName = useAppSelector(selectUserName);
	const profileRegistrationDate = useAppSelector(selectRegistrationDate);
	const achievementsData = useAppSelector(selectAchievementsWithProgress);

	// Link structure
	const linksData = [
		{
			key: 1,
			svg: <SupportIcon />,
			handler: () => {
				console.log('support-page');
			},
		},
	];

	// Structure of Statistics
	const statsData = [
		{
			key: 1,
			name: 'Rating:',
			count: useAppSelector(selectUserRating),
			svg: <ArrowRightIcon />,
			handler: () => {
				console.log('Rating');
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
			{/* Tabs */}
			<ul className='tabs mb--32'>
				{/* Tabs Item */}
				<li>
					<button
						className={`button tabs__item ${tab === 'first' ? 'active' : ''}`}
						onClick={() => setTab('first')}
					>
						Account
					</button>
				</li>

				{/* Tabs Item */}
				<li>
					<button
						className={`button tabs__item ${tab === 'second' ? 'active' : ''}`}
						onClick={() => setTab('second')}
					>
						Achievements
					</button>
				</li>
			</ul>

			{/* If first tab */}
			{tab === 'first' && (
				<>
					{/* Wrapper Nickname, Registration Dates */}
					<div className='user profile-page__user mb--16'>
						{/* Nickname */}
						<div className='user__name  profile-page__user-name'>
							<ProfileIcon />
							<span className='title fw--400 user__title'>{profileName}</span>
						</div>

						{/* Registration Dates */}
						<div>
							Registered: <span>{profileRegistrationDate}</span>
						</div>
					</div>

					{/* Wrapper Support */}
					<ul className='links mb--16'>
						{/* Links */}
						{linksData.map((element) => (
							<li className='links__item' key={element.key}>
								<button className='links__button' onClick={element.handler}>
									{element.svg}
								</button>
							</li>
						))}
					</ul>

					{/* Statistics Wrapper */}
					<div className='stats'>
						{/* Statistics List */}
						<ul className='stats__list'>
							{/* Elements of the list of statistics */}
							{statsData.map((element) => (
								<li className='stats__item' key={element.key}>
									{/* Data from statistical elements */}
									<div className='stats__data'>
										<span className='stats__name'>{element.name}</span>
										<span className='stats__count'>{element.count}</span>
									</div>

									{/* Link of statistical elements */}
									<button className='stats__button' onClick={element.handler}>
										{element.svg}
									</button>
								</li>
							))}
						</ul>
					</div>
				</>
			)}

			{/* If second tab */}
			{tab === 'second' && (
				<>
					{/* Achievement List */}
					<ul className='achievements'>
						{/* Achievements list item */}
						{achievementsData.map((element) => (
							<li
								className={`achievements__item ${element.done === true ? 'done' : ''}`}
								key={element.id}
							>
								{/* Element content*/}
								<div className='achievements__content'>
									{/* Achievement Title */}
									<h2 className='title lh--140 achievements__title'>{element.title}</h2>

									{/* Achievement Text */}
									<p className='lh--140 achievements__text'>{element.text}</p>
								</div>

								{/* Completed Achievement Icon */}
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
