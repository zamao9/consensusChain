import { useEffect, useState } from 'react';
import './tasksPage.sass';
import { AnimatePresence } from 'motion/react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectVisibleTasks } from '../../feature/tasks/tasksSelector';
import { claimTask, markTaskDone, setTasks } from '../../feature/tasks/tasksSlice';
import { selectUserId } from '../../feature/profile/profileSelector';
import { incrementBalance } from '../../feature/profile/profileSlice';
import Preloader from '../preloader/Preloader';

const TasksPage = () => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	// Функция для загрузки задач пользователя при монтировании компонента
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch(
					`https://web-production-c0b1.up.railway.app/users/${userId}/tasks`
				);
				if (!response.ok) {
					throw new Error('Failed to load tasks');
				}
				const data = await response.json();
				dispatch(setTasks(data.tasks)); // Устанавливаем задачи в Redux
			} catch (error) {
				console.error('Error fetching tasks:', error);
				alert('Failed to load tasks. Please try again later.'); // Выводим alert в случае ошибки
			} finally {
				setIsLoading(false); // Заканчиваем загрузку
			}
		};
		fetchTasks();
	}, [dispatch, userId]);

	const visibleTasks = useAppSelector(selectVisibleTasks);

	// Универсальная функция для отправки запросов на сервер
	const sendTaskRequest = async (url, method, queryParams, successCallback, errorCallback) => {
		try {
			// Формируем URL с query параметрами
			const queryString = new URLSearchParams(queryParams).toString();
			const fullUrl = `${url}?${queryString}`;

			const response = await fetch(fullUrl, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Server error');
			}

			const data = await response.json();
			successCallback(data); // Вызываем callback для успешного ответа
		} catch (error) {
			console.error(error);
			errorCallback(); // Вызываем callback для ошибки
		}
	};

	// Обработка кнопки GO
	const handleGo = async (taskKey) => {
		if (isProcessing) return;
		setIsProcessing(true);

		const url = `https://web-production-c0b1.up.railway.app/tasks/${taskKey}/done`;
		const queryParams = { user_id: userId };

		sendTaskRequest(
			url,
			'POST',
			queryParams,
			(data) => {
				dispatch(markTaskDone(taskKey)); // Обновляем состояние задачи
				console.log(data.message); // Логируем сообщение от сервера
			},
			() => {
				alert('Failed to mark task as done. Please try again later.'); // Выводим alert в случае ошибки
			}
		).finally(() => setIsProcessing(false));
	};

	// Обработка кнопки Claim
	const handleClaim = async (taskKey) => {
		if (isProcessing) return;
		setIsProcessing(true);

		const url = `https://web-production-c0b1.up.railway.app/tasks/${taskKey}/claimed`;
		const queryParams = { user_id: userId };
		const task = visibleTasks.find((t) => t.key === taskKey);
		if (!task) {
			alert('Task not found!');
			setIsProcessing(false);
			return;
		}
		sendTaskRequest(
			url,
			'POST',
			queryParams,
			(data) => {
				const cost = data.cost;
				dispatch(claimTask(taskKey)); // Обновляем состояние задачи
				dispatch(incrementBalance(Number(task.cost))); // Увеличиваем баланс пользователя
				console.log(data.message); // Логируем сообщение от сервера
			},
			() => {
				alert('Failed to claim task. Please try again later.'); // Выводим alert в случае ошибки
			}
		).finally(() => setIsProcessing(false));
	};

	const [taskIsEmpty, setTaskIsEmpty] = useState(false);

	useEffect(() => {
		if (visibleTasks.length === 0) {
			setTaskIsEmpty(true);
		} else {
			setTaskIsEmpty(false);
		}
	}, [visibleTasks]);

	return (
		<div className='tasks-page'>
			{isLoading ? (
				<Preloader
					isVisible={isLoading}
					color='#CECECE'
					size={60}
					message='Please wait, fetching data...'
				/>
			) : (
				// Если загрузка завершена (`isLoading` стало false), показываем загруженные данные.
				<>
					<h2 className='title mb--22 tasks-page__title'>Tasks</h2>

					{/* Список тасков */}
					{!taskIsEmpty ? (
						<ul className='tasks-page__list'>
							<AnimatePresence>
								{/* Таски */}
								{visibleTasks.map((element) => (
									<motion.li
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 20 }} // Анимация исчезновения
										className='tasks-page__item'
										key={element.key}
									>
										{/* Обертка Заголовка и Цены */}
										<div className='tasks-page__header'>
											{/* Заголовок элементов таска */}
											<h2 className='lh--140 tasks-page__item-title'>{element.title}</h2>
											{/* Цена таска */}
											<span className='tasks-page__cost'>{element.cost} TON</span>
										</div>
										{/* Разделительная линия */}
										<hr />
										{/* Обертка Таймера и Кнопки */}
										<div className='tasks-page__footer'>
											{/* Таймер */}
											<span className={`tasks-page__timer`}>{element.timer}</span>
											{/* Кнопка */}
											{!element.isDone && (
												<button
													type='button'
													className='button tasks-page__button'
													onClick={() => handleGo(element.key)}
													// disabled={isProcessing}
												>
													Go
												</button>
											)}
											{/* Кнопка */}
											{element.isDone && !element.isClaimed && (
												<button
													type='button'
													className='button tasks-page__button tasks-page__claim'
													onClick={() => handleClaim(element.key)}
													// disabled={isProcessing}
												>
													Claim
												</button>
											)}
										</div>
									</motion.li>
								))}
							</AnimatePresence>
						</ul>
					) : (
						<div className='empty-block'>
							<span className='lh--140'>Task not found for this user</span>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default TasksPage;
