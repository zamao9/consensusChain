import './introducingPage.sass';
import askPageImage from './../../assets/images/ask-page.jpg';
import tasksImage from './../../assets/images/tasks.jpg';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	BlockchainIcon,
	FriendsIcon,
	LikeIcon,
	Logo,
	ProfileIcon,
	ProfileInputIcon,
	QuestionsIcon,
	TasksIcon,
	TelegramIcon,
} from '../../constants/SvgIcons';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectUserId } from '../../feature/profile/profileSelector';
import { setIntroducingCheck } from '../../feature/profile/profileSlice';

const IntroducingPage = () => {
	const dispatch = useAppDispatch();
	const initialState = [
		{
			id: 1,
			svg: <Logo />,
			title: 'Hey! This is ConsensusChain, bro',
			description: 'Let us tell you a bit about our app.',
			image: null,
			input: false,
		},
		{
			id: 2,
			svg: <QuestionsIcon />,
			title: 'Ask a Question',
			description:
				'Every day, you can ask up to 3 questions using tags that interest you. Other users will help you find answers.',
			image: askPageImage,
			input: false,
		},
		{
			id: 3,
			svg: <LikeIcon />,
			title: 'Like = Rating',
			description: 'Like helpful answers. For every like on your answer, you earn rating points.',
			image: null,
			input: false,
		},
		{
			id: 4,
			svg: <FriendsIcon />,
			title: 'Invite friends!',
			description:
				'Share your invite link. For each friend, you get bonuses and increase your rating.',
			image: null,
			input: false,
		},
		{
			id: 5,
			svg: <TasksIcon />,
			title: 'Complete Tasks',
			description:
				'You can complete tasks: ask a question, get a like, invite a friend. Complete them to earn more points!',
			image: tasksImage,
			input: false,
		},
		{
			id: 6,
			svg: <TelegramIcon />,
			title: 'Simple and Convenient',
			description:
				'Everything happens right in Telegram. Likes, questions, answers-all at your fingertips. Handy notifications directly in the chat.',
			image: null,
			input: false,
		},
		{
			id: 7,
			svg: <BlockchainIcon />,
			title: 'And in the future...',
			description:
				'We plan to add something interesting related to exchanging the points you’ve earned.',
			image: null,
			input: false,
		},
		{
			id: 8,
			svg: <ProfileIcon />,
			title: 'Enter your name and let’s get started!',
			description: null,
			image: null,
			input: true,
		},
	];

	const userId = useAppSelector(selectUserId);

	const submitNickName = () => {
		const fetchIntroducingStatus = async () => {
			try {
				const response = await fetch(
					`https://web-production-c0b1.up.railway.app/user-state/${userId}/set-introducing-page-status?status=true`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if (!response.ok) throw new Error('Failed to fetch statistics');
				const data = await response.json();
				console.log(data.message);
				dispatch(setIntroducingCheck(false));
			} catch (error) {
				setError('Error fetching user statistics');
				console.error('Error fetching user statistics:', error);
			}
		};
		fetchIntroducingStatus();
	};

	const [currentIndex, setCurrentIndex] = useState(0);
	const currentElement = initialState[currentIndex];

	const previousButton = () => {
		if (currentIndex !== 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const nextButton = () => {
		if (currentIndex !== initialState.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	return (
		<ul className='introducing-page ta--c'>
			<li key={currentElement.id}>
				{/* Introducing Svg */}
				{currentElement.svg && (
					<div className='mb--22 introducing-page__svg'>{currentElement.svg}</div>
				)}

				{/* Introducing Title */}
				<h1 className='title introducing-page__title'>{currentElement.title}</h1>

				{/* Introducing Description */}
				<p className='lh--140 introducing-page__description'>{currentElement.description}</p>

				{/* Introducing Image */}
				{currentElement.image && (
					<div className='mt--22 introducing-page__image'>
						<img src={currentElement.image} alt='' />
					</div>
				)}

				{/* Introducing Input Field */}
				{currentElement.input && (
					<div className='input-field mt--32'>
						<div className='input input-relative mb--10'>
							<input type='text' placeholder='@nickname' />
							<ProfileInputIcon />
						</div>

						{/* Submit button */}
						<button type='button' className='submit-button' onClick={() => submitNickName()}>
							Submit
						</button>
					</div>
				)}

				{/* Dots Wrapper */}
				<div className='mt--32 dots'>
					{initialState.map((element) => (
						<div
							className={`dots__item ${element.id === currentIndex + 1 ? 'active' : ''}`}
							key={element.id}
						></div>
					))}
				</div>

				{/* Buttons Wrapper */}
				<div className='mt--32 introducing-page__button-wrapper'>
					{/* Button */}
					<button
						type='button'
						className='button introducing-page__button'
						onClick={previousButton}
						disabled={currentIndex === 0}
					>
						<ArrowLeftIcon />
					</button>

					{/* Button */}
					<button
						type='button'
						className='button introducing-page__button'
						onClick={nextButton}
						disabled={currentIndex === initialState.length - 1}
					>
						<ArrowRightIcon />
					</button>
				</div>
			</li>
		</ul>
	);
};

export default IntroducingPage;
