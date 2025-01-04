import { useState } from 'react';
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

const NotificationsPage = ({ setPopup, setPopupSvg, setPopupText, setPopupSource }) => {
	// Стриктура списка уведомлений
	const notificationsData = [
		{
			key: 1,
			text: 'Blabla left a comment on your question.',
			type: 'comment',
			date: '23.01.2025',
			isRead: false,
		},
		{
			key: 2,
			text: 'Your report ... was accept and ...',
			type: 'report',
			date: '23.01.2025',
			isRead: false,
		},
		{
			key: 3,
			text: 'System update 12.0.1 v.',
			type: 'system',
			date: '23.01.2025',
			isRead: false,
		},
		{
			key: 4,
			text: 'Gugugaga liked your question.',
			type: 'like',
			date: '23.01.2025',
			isRead: false,
		},
	];

	// Стриктура списка фильтрации
	const notificationsFilterData = [
		{
			key: 1,
			type: 'comment',
			text: 'Comments notices',
			status: true,
		},
		{
			key: 2,
			type: 'report',
			text: 'Reports notices',
			status: true,
		},
		{
			key: 3,
			type: 'system',
			text: 'System notices',
			status: true,
		},
		{
			key: 4,
			type: 'like',
			text: 'Like notices',
			status: true,
		},
	];

	const [curItem, setItem] = useState(false);
	const [radio, setRadio] = useState(notificationsFilterData);
	const [status, setStatus] = useState(notificationsData);

	// Клик на элементы списка уведомлений
	const updateNotifications = (key, status, setStatus) => {
		let statusNew = status.slice();

		statusNew.map((element) => {
			if (element.key === key) {
				element.isRead = true;
			}
		});
		setStatus(statusNew);
	};

	// Радио кнопки клик
	const radioHandler = (key, status, setStatus) => {
		let statusNew = status.slice();

		statusNew.map((element) => {
			if (element.key === key) {
				element.status = !element.status;
			}
		});
		setStatus(statusNew);
	};

	// Сортировка
	const filteredNotifications = status
		.filter((notification) => {
			const typeStatus = radio.find((opt) => opt.type === notification.type)?.status;
			return typeStatus;
		})
		.sort((a, b) => (a.isRead ? 1 : -1));

	return (
		<div className='notifications-page'>
			{/* Обертка Заголовка, Кнопки фильтрации */}
			<div className='notifications-page__header  mb--22'>
				{/* Заголовок */}
				<h2 className='title lh--140 notifications-page__title'>Notifications</h2>

				{/* Кнопка фильтрации */}
				<div className='notifications-page__button-wrapper'>
					<button
						className={`button notifications-page__button ${curItem === true ? 'active' : ''}`}
						onClick={() => {
							setItem(!curItem);
						}}
					>
						<FilterIcon />
					</button>
				</div>
			</div>

			{/* Список уведомлений */}
			<ul className='mb--32 notifications-page__list'>
				{/* Список элементов Фильтрации */}
				{curItem === true && (
					<AnimatePresence>
						<motion.ul className='notifications-filter'>
							{/* Элементы списка фильтрации */}
							{radio.map((element) => (
								<li className='notifications-filter__item' key={element.key}>
									<span>{element.text}</span>
									<button
										type='button'
										className={`radio ${element.status === true ? 'active' : ''}`}
										onClick={() => radioHandler(element.key, radio, setRadio)}
									>
										<div className='radio__button'></div>
									</button>
								</li>
							))}
						</motion.ul>
					</AnimatePresence>
				)}

				{/* Элементы списка уведомлений */}
				{filteredNotifications.map((element) => (
					<li key={element.key}>
						<button
							type='button'
							className={`notifications-page__item ${element.isRead === true ? 'is-read' : ''}`}
							onClick={() => {
								updateNotifications(element.key, status, setStatus);
								console.log(element.text);
								setPopup(true);
								setPopupSvg(
									(element.type === 'system' && <SettingsIcon />) ||
										(element.type === 'comment' && <CommentsIcon />) ||
										(element.type === 'report' && <ReportIcon />) ||
										(element.type === 'like' && <LikeIcon />)
								);
								setPopupText(element.text);
								setPopupSource('notifications-page');
							}}
						>
							{/* Описание элемента */}
							<h2 className='title lh--140 fw--400 notifications-page__title'>{element.text}</h2>

							{/* Разделительная линия */}
							<hr />

							{/* Дата элемента */}
							<span className='notifications-page__date'>{element.date}</span>

							{/* Тип иконки */}
							<div className='notifications-page__icon'>
								{(element.type === 'system' && <SettingsIcon />) ||
									(element.type === 'comment' && <CommentsIcon />) ||
									(element.type === 'report' && <ReportIcon />) ||
									(element.type === 'like' && <LikeIcon />)}
							</div>
						</button>
					</li>
				))}
			</ul>

			{/* Пагинация */}
			<div className='pagination'>
				<button className={`pagination__button`} onClick={() => console.log('first')}>
					<DblArrowLeftIcon />
				</button>
				<button className={`pagination__button`} onClick={() => console.log('prev')}>
					<ArrowLeftIcon />
				</button>

				{/* Счетчик страниц */}
				<div className='pagination__counter'>1 / 3</div>

				<button className={`pagination__button `} onClick={() => console.log('next')}>
					<ArrowRightIcon />
				</button>
				<button className={`pagination__button `} onClick={() => console.log('last')}>
					<DblArrowRightIcon />
				</button>
			</div>
		</div>
	);
};

export default NotificationsPage;
