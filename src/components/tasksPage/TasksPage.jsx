import { useState } from 'react';
import './tasksPage.sass';
import { AnimatePresence } from 'motion/react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectVisibleTasks } from '../../feature/tasks/tasksSelector';
import { claimTask, markTaskDone } from '../../feature/tasks/tasksSlice';

const TasksPage = () => {
	const dispatch = useAppDispatch();

	const visibleTasks = useAppSelector(selectVisibleTasks);

	// Обработка кнопки GO
	const handleGo = (taskKey) => {
		setTimeout(() => {
			dispatch(markTaskDone(taskKey));
		}, 1000); // Задержка 1 секунд
	};
	// Обработка кнопки Claim
	const handleClaim = (taskKey) => {
		dispatch(claimTask(taskKey));
	};

	return (
		<div className='tasks-page'>
			<h2 className='title mb--22 tasks-page__title'>Tasks</h2>
			{/* Список тасков */}
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
								{/* Заголовок эелементов таска */}
								<h2 className='lh--140 tasks-page__item-title'>{element.title}</h2>

								{/* Цена таска */}
								<span className='tasks-page__cost'>{element.cost} TON</span>
							</div>

							{/* Разделительнач линия */}
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
									>
										Claim
									</button>
								)}
							</div>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</div>
	);
};

export default TasksPage;
