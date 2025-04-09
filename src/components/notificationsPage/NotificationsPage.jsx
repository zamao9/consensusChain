import './notificationsPage.sass';
import { useState, useEffect, useRef } from 'react';
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
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectUserId } from '../../feature/profile/profileSelector';
import { setNotificationList, markAsRead } from '../../feature/notifications/notificationsSlice';
import { selectAllNotifications } from '../../feature/notifications/notificationsSelector';
import Preloader from '../preloader/Preloader';

const NotificationsPage = ({ setPopup, setPopupSvg, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1); // Current page
	const [itemsPerPage] = useState(5); // Number of elements on the page
	const [filterButtonNav, setFilterButtonNav] = useState(false); // click on filter button

	const [radio, setRadio] = useState([
		{ key: 1, type: 'trace', text: 'Trace notices', status: true },
		{ key: 2, type: 'report', text: 'Reports notices', status: true },
		{ key: 3, type: 'system', text: 'System notices', status: true },
		{ key: 4, type: 'like', text: 'Like notices', status: true },
	]);

	// Downloading notifications from the server
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

	// Clicking on items in the notification list
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

	// Radio click buttons
	const radioHandler = (key) => {
		setRadio((prev) =>
			prev.map((element) =>
				element.key === key ? { ...element, status: !element.status } : element
			)
		);
	};

	const notificationsData = useAppSelector(selectAllNotifications);

	// Filtering and sorting notifications
	const filteredNotifications = notificationsData
		.filter((notification) => {
			const typeStatus = radio.find((opt) => opt.type === notification.type)?.status;
			return typeStatus;
		})
		.sort((a, b) => (a.isRead ? 1 : -1));

	// Pagination
	const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);

	// Pagination handlers
	const goToFirstPage = () => {
		setCurrentPage(1);
		setFilterButtonNav(false);
	};
	const goToPreviousPage = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 1));
		setFilterButtonNav(false);
	};
	const goToNextPage = () => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages));
		setFilterButtonNav(false);
	};
	const goToLastPage = () => {
		setCurrentPage(totalPages);
		setFilterButtonNav(false);
	};

	// Click outside of an element makes filter button and wrapper close
	const filterWrapper = useRef(null);
	const handleCLickOutsideFilterWrapper = () => {
		if (filterWrapper.current && !filterWrapper.current.contains(event.target)) {
			setFilterButtonNav(false);
		}
	};

	// When filtering is open, disallow scrolling
	useEffect(() => {
		if (filterButtonNav) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
		document.addEventListener('mousedown', handleCLickOutsideFilterWrapper);
	}, [filterButtonNav]);

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
					{/* Header and filter button */}
					<div className='notifications-page__header mb--32'>
						{/* Title */}
						<h2 className='title notifications-page__title'>Notifications</h2>

						{/* Button Wrapper */}
						<div className='button-wrapper'>
							{/* Filter Button */}
							<button
								className={`button ${filterButtonNav ? 'active' : ''}`}
								onClick={() => setFilterButtonNav(!filterButtonNav)}
								disabled={filterButtonNav}
							>
								<FilterIcon />
							</button>
						</div>
					</div>

					{/* Filter list */}
					{filterButtonNav && (
						<search>
							<form>
								<AnimatePresence>
									<motion.ul
										className='notifications-filter'
										ref={filterWrapper}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										{/* Filter list item */}
										{radio.map((element) => (
											<li className='notifications-filter__item' key={element.key}>
												{/* Filter Text */}
												<label>{element.text}</label>

												{/* Radio filter button */}
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
							</form>
						</search>
					)}

					{/* Notifications list */}
					<section className='mb--32 notifications-page__list'>
						{currentNotifications.map((element) => (
							<article key={element.id}>
								<h2 className='visually-hidden'>Notification item</h2>
								{/* Notifications list items */}
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
									{/* Notification list text */}
									<h3 className='title notifications-page__title'>{element.title}</h3>

									{/* Dividing line */}
									<hr />

									{/* Wrapping the date and time of the item */}
									<div className='notifications-page__date-wrapper'>
										{/* Date of element */}
										<time dateTime={element.createdAt.date}>{element.createdAt.date}</time>

										{/* Element time */}
										<time dateTime={element.createdAt.time}>{element.createdAt.time}</time>
									</div>

									{/* Icon type */}
									<div className='notifications-page__icon'>
										{(element.type === 'system' && <SettingsIcon />) ||
											(element.type === 'trace' && <CommentsIcon />) ||
											(element.type === 'report' && <ReportIcon />) ||
											(element.type === 'like' && <LikeIcon />)}
									</div>
								</button>
							</article>
						))}
					</section>

					{/* Pagination */}
					<div className='button-wrapper pagination'>
						<button
							className='button pagination__button'
							onClick={goToFirstPage}
							disabled={currentPage - 1 < 1}
						>
							<DblArrowLeftIcon />
						</button>
						<button
							className='button pagination__button'
							onClick={goToPreviousPage}
							disabled={currentPage - 1 < 1}
						>
							<ArrowLeftIcon />
						</button>
						<div className='pagination__counter'>
							{currentPage > totalPages ? '0' : currentPage} / {totalPages}
						</div>
						<button
							className='button pagination__button'
							onClick={goToNextPage}
							disabled={currentPage + 1 > totalPages}
						>
							<ArrowRightIcon />
						</button>
						<button
							className='button pagination__button'
							onClick={goToLastPage}
							disabled={currentPage + 1 > totalPages}
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
