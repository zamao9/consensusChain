import { useState, useEffect } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CommentsIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
	FilterIcon,
	LikeIcon,
	ReportIcon,
	SettingsIcon,
} from '../../constants/SvgIcons';
import './notificationsPage.sass';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectUserId } from '../../feature/profile/profileSelector';
import { setNotificationList, markAsRead } from '../../feature/notifications/notificationsSlice';
import { selectAllNotifications } from '../../feature/notifications/notificationsSelector';
import Preloader from '../preloader/Preloader';

const NotificationsPage = ({ popup, setPopup, setPopupSvg, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isLoading, setIsLoading] = useState(true);
	const [curItem, setItem] = useState(false);
	const [currentPage, setCurrentPage] = useState(1); // Текущая страница
	const [itemsPerPage] = useState(3); // Количество элементов на странице

	const [radio, setRadio] = useState([
		{ key: 1, type: 'trace', text: 'Trace notices', status: true },
		{ key: 2, type: 'report', text: 'Reports notices', status: true },
		{ key: 3, type: 'system', text: 'System notices', status: true },
		{ key: 4, type: 'like', text: 'Like notices', status: true },
	]);

	// Загрузка уведомлений с сервера
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch(
					`https://web-production-c0b1.up.railway.app/users/${userId}/notifications?unread_only=false`
				);
				if (!response.ok) {
					throw new Error('Failed to load notifications');
				}
				const data = await response.json();
				dispatch(setNotificationList(data));
			} catch (error) {
				console.error('Error fetching notifications:', error);
				alert('Failed to load notifications. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};
		fetchNotifications();
	}, [dispatch, userId]);

	// Клик на элементы списка уведомлений
	const updateNotifications = async (id) => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/users/${userId}/notifications/mark-as-read`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify([id]),
				}
			);
			if (!response.ok) {
				throw new Error('Failed to mark notification as read');
			}
			dispatch(markAsRead(id));
		} catch (error) {
			console.error('Error marking notification as read:', error);
			alert('Failed to mark notification as read. Please try again later.');
		}
	};

	// Радио кнопки клик
	const radioHandler = (key) => {
		setRadio((prev) =>
			prev.map((element) =>
				element.key === key ? { ...element, status: !element.status } : element
			)
		);
	};

	const notificationsData = useAppSelector(selectAllNotifications);

	// Фильтрация и сортировка уведомлений
	const filteredNotifications = notificationsData
		.filter((notification) => {
			const typeStatus = radio.find((opt) => opt.type === notification.type)?.status;
			return typeStatus;
		})
		.sort((a, b) => (a.isRead ? 1 : -1));

	// Пагинация
	const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);

	// Обработчики пагинации
	const goToFirstPage = () => setCurrentPage(1);
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToLastPage = () => setCurrentPage(totalPages);

	// При открытой фильтрации запретить скролл
	useEffect(() => {
		console.log('popupStatus:', popup);
		console.log('curItemStatus:', curItem);
		if (curItem) {
			document.body.classList.add('no-scroll');
			console.log('on');
		} else {
			document.body.classList.remove('no-scroll');
			console.log('off');
		}
	}, [curItem]);

	return (
		<div className='notifications-page'>
			{isLoading ? (
				<Preloader
					isVisible={isLoading}
					color='#CECECE'
					size={60}
					message='Please wait, fetching data...'
				/>
			) : (
				<>
					{/* Заголовок и кнопка фильтрации */}
					<div className='notifications-page__header mb--32'>
						<h2 className='title lh--140 notifications-page__title'>Notifications</h2>
						<div className='notifications-page__button-wrapper'>
							<button
								className={`button notifications-page__button ${curItem ? 'active' : ''}`}
								onClick={() => setItem(!curItem)}
							>
								<FilterIcon />
							</button>
						</div>
					</div>

					{/* Список фильтрации */}
					{curItem && (
						<AnimatePresence>
							<motion.ul className='notifications-filter'>
								{radio.map((element) => (
									<li className='notifications-filter__item' key={element.key}>
										<span>{element.text}</span>
										<button
											type='button'
											className={`radio ${element.status ? 'active' : ''}`}
											onClick={() => radioHandler(element.key)}
										>
											<div className='radio__button'></div>
										</button>
									</li>
								))}
							</motion.ul>
						</AnimatePresence>
					)}

					{/* Список уведомлений */}

					<ul className='mb--32 notifications-page__list'>
						{currentNotifications.map((element) => (
							<li key={element.id}>
								<button
									type='button'
									className={`notifications-page__item ${element.isRead ? 'is-read' : ''}`}
									onClick={() => {
										updateNotifications(element.id);
										setPopup(true);
										setPopupSvg(
											(element.type === 'system' && <SettingsIcon />) ||
												(element.type === 'trace' && <CommentsIcon />) ||
												(element.type === 'report' && <ReportIcon />) ||
												(element.type === 'like' && <LikeIcon />)
										);
										setPopupText(element.description);
										setPopupSource('notifications-page');
									}}
								>
									<h2 className='title lh--140 fw--400 notifications-page__title'>
										{element.title}
									</h2>
									<hr />
									<span className='notifications-page__date'>{element.createdAt}</span>
									<div className='notifications-page__icon'>
										{(element.type === 'system' && <SettingsIcon />) ||
											(element.type === 'trace' && <CommentsIcon />) ||
											(element.type === 'report' && <ReportIcon />) ||
											(element.type === 'like' && <LikeIcon />)}
									</div>
								</button>
							</li>
						))}
					</ul>

					{/* Пагинация */}
					<div className='pagination'>
						<button
							className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
							onClick={goToFirstPage}
							disabled={currentPage === 1}
						>
							<DblArrowLeftIcon />
						</button>
						<button
							className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
							onClick={goToPreviousPage}
							disabled={currentPage === 1}
						>
							<ArrowLeftIcon />
						</button>
						<div className='pagination__counter'>
							{currentPage} / {totalPages}
						</div>
						<button
							className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`}
							onClick={goToNextPage}
							disabled={currentPage === totalPages}
						>
							<ArrowRightIcon />
						</button>
						<button
							className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`}
							onClick={goToLastPage}
							disabled={currentPage === totalPages}
						>
							<DblArrowRightIcon />
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default NotificationsPage;
