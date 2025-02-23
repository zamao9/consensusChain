import './appScreen.sass';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Marquees from '../marquees/Marquees';
import AskPage from '../askPage/AskPage';
import { useState, useEffect } from 'react';
import QuestionsPage from '../questionsPage/QuestionsPage';
import TasksPage from '../tasksPage/TasksPage';
import CommentsPage from '../commentsPage/CommentsPage';
import ProfilePage from '../profilePage/ProfilePage';
import PopupBackground from '../popupBackground/PopupBackground';
import NotificationsPage from '../notificationsPage/NotificationsPage';
import RepliesSentPage from '../repliesSentPage/RepliesSentPage';
import Preloader from '../preloader/Preloader';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import {
	setAnswersCount,
	setBalance,
	setId,
	setLikesReceived,
	setName,
	setQuestionsCount,
	setRating,
	setReceivedAnswersCount,
	setRegistrationDate,
} from '../../feature/profile/profileSlice';

import {
	selectCurItem,
	selectCurPage,
	selectPopup,
	selectTab,
	selectPopupText,
	selectPopupSource,
} from '../../feature/userInterface/userIntarfaceSelector';
import {
	setCurItem,
	setCurPage,
	setPopup,
	setTab,
	setPopupText,
	setPopupSource,
} from '../../feature/userInterface/userInterfaceSlice';
import FriendsPage from '../friendsPage/FriendsPage';

const AppScreen = () => {
	const dispatch = useAppDispatch();
	const [userData, setUserData] = useState(null);
	const [userStats, setUserStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	// Получаем userId из URL
	const urlWindow = window.location.href;
	const url = new URL(urlWindow);
	const params = new URLSearchParams(url.search);
	// const userIdFromUrlBot = params.get('user_id');
	const userIdFromUrlBot = '6621151292';
	const [userIdFromUrl, setUserIdFromUrl] = useState(userIdFromUrlBot);

	useEffect(() => {
		// Проверяем, что объект Telegram существует и содержит нужные данные
		if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
			const initData = Telegram.WebApp.initData;

			if (initData) {
				const parsedInitData = new URLSearchParams(initData);
				const userParam = parsedInitData.get('user');

				if (userParam) {
					try {
						const userData = JSON.parse(userParam);
						if (userData && typeof userData.id !== 'undefined') {
							setUserIdFromUrl(userData.id);
						} else {
							//setUserIdFromUrl('6621151292');
						}
					} catch (error) {
						console.error('Ошибка при парсинге данных пользователя:', error);
					}
				} else {
					//setUserIdFromUrl('6621151292');
				}
			}
		} else {
			//setUserIdFromUrl('6621151292');
		}
	}, []);

	useEffect(() => {
		// Запрос для получения данных пользователя
		const fetchUserData = async () => {
			try {
				const response = await fetch(
					`https://web-production-c0b1.up.railway.app/users/${userIdFromUrl}`
				);
				if (!response.ok) throw new Error('Failed to fetch user data');
				const data = await response.json();
				setUserData(data); // Сохраняем данные пользователя в локальном состоянии

				// Устанавливаем данные в Redux
				dispatch(setId(data.user_id));
				dispatch(setName(data.fullName));
				dispatch(setRegistrationDate(data.registrationDate));
				dispatch(setBalance(Number(data.balance)));
				dispatch(setRating(data.rating));
			} catch (error) {
				setError('Error fetching user data');
				console.error('Error fetching user data:', error);
			}
		};

		// Запрос для получения статистики пользователя
		const fetchUserStatistics = async () => {
			try {
				const response = await fetch(
					`https://web-production-c0b1.up.railway.app/users/${userIdFromUrl}/statistics`
				);
				if (!response.ok) throw new Error('Failed to fetch statistics');
				const data = await response.json();
				setUserStats(data); // Сохраняем статистику в локальном состоянии

				// Устанавливаем статистику в Redux
				dispatch(setLikesReceived(data.likesReceived));
				dispatch(setQuestionsCount(data.questionsCount));
				dispatch(setAnswersCount(data.answersCount));
				dispatch(setReceivedAnswersCount(data.receivedAnswersCount));
			} catch (error) {
				setError('Error fetching user statistics');
				console.error('Error fetching user statistics:', error);
			}
		};

		// Выполняем оба запроса
		fetchUserData();
		fetchUserStatistics();
	}, [userIdFromUrl, dispatch]);

	useEffect(() => {
		if (userData && userStats) {
			setLoading(false); // Если данные загружены, меняем состояние
		}
	}, [userData, userStats]);

	if (error) {
		return <div>{error}</div>; // Отображаем ошибки, если они есть
	}

	// Получаем состояние из Redux
	const curItem = useAppSelector(selectCurItem);
	const curPage = useAppSelector(selectCurPage);
	const popup = useAppSelector(selectPopup);
	const tab = useAppSelector(selectTab);
	const popupText = useAppSelector(selectPopupText);
	const popupSource = useAppSelector(selectPopupSource);
	const [popupSvg, setPopupSvg] = useState(''); // svg в Popup

	useEffect(() => {
		if (popup) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [popup]);
	//console.log(popupSource)

	return (
		<>
			{/* HEADER */}
			<Header
				curItem={curItem}
				setItem={(item) => dispatch(setCurItem(item))}
				setPage={(page) => dispatch(setCurPage(page))}
				setTab={(tab) => dispatch(setTab(tab))}
			/>

			{/* SECTION */}
			<main className='section'>
				{/* MARQUEES */}
				<Marquees />

				{/* CONTAINER */}
				<div id='scrollableDiv' className='container' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
					{/* POPUP */}
					{popup && (
						<PopupBackground
							popupSvg={popupSvg}
							setPopup={(value) => dispatch(setPopup(value))}
							popupText={popupText}
							setPopupText={(text) => dispatch(setPopupText(text))}
							popupSource={popupSource}
							setPopupSource={(source) => dispatch(setPopupSource(source))}
						/>
					)}

					{/* PRELOADER */}
					{curPage === 'preloader' && (
						<Preloader
							isVisible={true}
							color='#FF5733'
							size={60}
							message='Please wait, fetching data...'
						/>
					)}

					{/* NOTIFICATIONS */}
					{curPage === 'notifications-page' && (
						<NotificationsPage
							setPopupSvg={setPopupSvg}
							setPopup={(value) => dispatch(setPopup(value))}
							setPopupText={(text) => dispatch(setPopupText(text))}
							setPopupSource={(source) => dispatch(setPopupSource(source))}
						/>
					)}

					{/* PROFILE */}
					{curPage === 'profile-page' && (
						<ProfilePage
							tab={tab}
							setTab={(tab) => dispatch(setTab(tab))}
							setPage={(page) => dispatch(setCurPage(page))}
							setItem={(item) => dispatch(setCurItem(item))}
						/>
					)}

					{/* FRIENDS */}
					{curPage === 'friends-page' && <FriendsPage />}

					{/* REPLIES SENT */}
					{curPage === 'replies-sent-page' && <RepliesSentPage />}

					{/* ASK */}
					{curPage === 'ask-page' && (
						<AskPage
							setPopup={(value) => dispatch(setPopup(value))}
							setPopupText={(text) => dispatch(setPopupText(text))}
							setPopupSource={(source) => dispatch(setPopupSource(source))}
						/>
					)}

					{/* QUESTIONS-PAGE */}
					{curPage === 'questions-page' && (
						<QuestionsPage
							setPage={(page) => dispatch(setCurPage(page))}
							setItem={(item) => dispatch(setCurItem(item))}
							setPopup={(value) => dispatch(setPopup(value))}
							setPopupText={(text) => dispatch(setPopupText(text))}
							setPopupSource={(source) => dispatch(setPopupSource(source))}
							popupSource={popupSource}
						/>
					)}

					{/* COMMENTS */}
					{curPage === 'comments-page' && (
						<CommentsPage
							setPopup={(value) => dispatch(setPopup(value))}
							setPopupText={(text) => dispatch(setPopupText(text))}
							setPopupSource={(source) => dispatch(setPopupSource(source))}
						/>
					)}

					{/* TASKS */}
					{curPage === 'tasks-page' && <TasksPage />}
				</div>
			</main>

			{/* FOOTER */}
			<Footer
				curItem={curItem}
				setItem={(item) => dispatch(setCurItem(item))}
				setPage={(page) => dispatch(setCurPage(page))}
			/>
		</>
	);
};

export default AppScreen;
