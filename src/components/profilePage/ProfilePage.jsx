import './profilePage.sass';
import {
	ArrowRightIcon,
	FriendsIcon,
	ProfileIcon,
	SuccessIcon,
	SupportIcon,
} from '../../constants/SvgIcons';
import { useAppSelector } from '../../hooks/store';
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
	const profileName = useAppSelector(selectUserName);
	const profileRegistrationDate = useAppSelector(selectRegistrationDate);
	const achievementsData = useAppSelector(selectAchievementsWithProgress);

	// Link structure
	const linksData = [
		{
			key: 1,
			svg: <FriendsIcon />,
			handler: () => {
				setPage('friends-page');
				setItem('');
			},
		},
		{
			key: 2,
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
			{/* Wrapper for buttons, links, tabs etc. */}
			<div className='button-wrapper mb--32'>
				{/* Tabs */}
				<ul className='tabs'>
					{/* Tabs Item */}
					<li>
						<button
							className={`tabs__item ${tab === 'first' ? 'active' : ''}`}
							onClick={() => setTab('first')}
						>
							Account
						</button>
					</li>

					{/* Tabs Item */}
					<li>
						<button
							className={`tabs__item ${tab === 'second' ? 'active' : ''}`}
							onClick={() => setTab('second')}
						>
							Achievements
						</button>
					</li>
				</ul>
			</div>

			{/* If first tab */}
			{tab === 'first' && (
				<>
					{/* Wrapper Nickname, Registration Dates */}
					<div className='profile-page__user-wrapper mb--16'>
						{/* User */}
						<div className='user'>
							<ProfileIcon />
							<span className='user__name profile-page__user-name'>{profileName}</span>
						</div>

						{/* Registration Dates */}
						<div>
							Registered: <span>{profileRegistrationDate}</span>
						</div>
					</div>

					{/* Links wrapper */}
					<ul className='profile-page__links-wrapper mb--16'>
						{/* Wrapper for buttons, links, tabs etc. */}
						{linksData.map((element) => (
							<li className='button-wrapper' key={element.key}>
								{/* Link | Profile link */}
								<button className='link' onClick={element.handler}>
									{element.svg}
								</button>
							</li>
						))}
					</ul>

					{/* Statistics Wrapper */}
					<div className='statsistics'>
						{/* Statistics List */}
						<ul className='statsistics__list'>
							{/* Elements of the list of statistics */}
							{statsData.map((element) => (
								<li className='statsistics__item' key={element.key}>
									{/* Data from statistical elements */}
									<div className='statsistics__data'>
										<span className='statsistics__name'>{element.name}</span>
										<span className='statsistics__count'>{element.count}</span>
									</div>

									{/* Link */}
									<button className='link' onClick={element.handler}>
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
									<h2 className='title achievements__title'>{element.title}</h2>

									{/* Achievement Text */}
									<p className='achievements__text'>{element.text}</p>
								</div>

								{/* Completed Achievement Icon */}
								{element.done === true && (
									<div className='achievements__icon'>
										<SuccessIcon />
									</div>
								)}

								{/* Achievement Progression */}
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
