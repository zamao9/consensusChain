import Footer from '../footer/Footer';
import Header from '../header/Header';
import Marquees from '../marquees/Marquees';
import AskPage from '../askPage/AskPage';
import './appScreen.sass';
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
	const userIdFromUrlBot = '5499493097';
	const [userIdFromUrl, setUserIdFromUrl] = useState(userIdFromUrlBot);

	useEffect(() => {
		// Проверяем, что объект Telegram существует и содержит нужные данные
		if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
			const initData = Telegram.WebApp.initData;
			console.log('initData', initData);

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

	const [curItem, setItem] = useState('ask-page'); // активный элемент навигации
	const [curPage, setPage] = useState('ask-page'); // активная страница
	const [popup, setPopup] = useState(false); // активация Popup
	const [tab, setTab] = useState('first'); // табы
	const [popupSvg, setPopupSvg] = useState(''); // svg в Popup
	const [popupText, setPopupText] = useState(''); // текст в Popup
	const [popupSource, setPopupSource] = useState(null);
	const [answer, setAnswer] = useState(false);

	useEffect(() => {
		if (popup) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [popup]);

	return (
		<>
			{/* Страница Header */}
			<Header curItem={curItem} setItem={setItem} setPage={setPage} setTab={setTab} />

			<main className='section main'>
				{/* Marquees */}
				<Marquees />

				<div className='container'>
					{/* Стриница Popup */}
					{popup === true && (
						<PopupBackground
							setPopup={setPopup}
							popupSvg={popupSvg}
							popupText={popupText}
							setPopupText={setPopupText}
							popupSource={popupSource}
							setPopupSource={setPopupSource}
							setAnswer={setAnswer}
						/>
					)}

					{/*  Preloader */}
					{curPage === 'preloader' && (
						<Preloader
							isVisible={true}
							color='#FF5733'
							size={60}
							message='Please wait, fetching data...'
						/>
					)}

					{/* PROFILE */}
					{curPage === 'profile-page' && (
						<ProfilePage tab={tab} setTab={setTab} setPage={setPage} setItem={setItem} />
					)}

					{/* REPLIES SENT */}
					{curPage === 'replies-sent-page' && <RepliesSentPage />}

					{/* Страница Notifications */}
					{curPage === 'notifications-page' && (
						<NotificationsPage
							popup={popup}
							setPopup={setPopup}
							setPopupSvg={setPopupSvg}
							setPopupText={setPopupText}
							setPopupSource={setPopupSource}
						/>
					)}

					{/* Страница Ask */}
					{curPage === 'ask-page' && (
						<AskPage
							setPopup={setPopup}
							setPopupText={setPopupText}
							setPopupSource={setPopupSource}
						/>
					)}

					{/* Страница Questions */}
					{curPage === 'questions-page' && (
						<QuestionsPage
							setPage={setPage}
							setItem={setItem}
							setPopup={setPopup}
							setPopupText={setPopupText}
							setPopupSource={setPopupSource}
						/>
					)}

					{/* Страница Tasks */}
					{curPage === 'tasks-page' && <TasksPage />}

					{/* Страница Comments */}
					{curPage === 'comments-page' && (
						<CommentsPage
							setPopup={setPopup}
							setPopupText={setPopupText}
							setPopupSource={setPopupSource}
							answer={answer}
						/>
					)}
				</div>
			</main>
			{/* Footer */}
			<Footer curItem={curItem} setItem={setItem} setPage={setPage} />
		</>
	);
};

export default AppScreen;
