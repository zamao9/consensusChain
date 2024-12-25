import { useState } from 'react';
import './tasksPage.sass';
import { AnimatePresence } from 'motion/react';
import { motion } from 'framer-motion';

const TasksPage = () => {
	const tasksData = [
		{
			key: 1,
			title: 'Subscribe our discord channel.',
			isClaimed: false,
			isDone: false,
			cost: 1000,
			timer: '10:23:15',
		},
		{
			key: 2,
			title: 'Subscribe our telegram channel.',
			isClaimed: false,
			isDone: false,
			cost: 100,
			timer: '10:23:15',
		},
		{
			key: 3,
			title: 'Post your first public question.',
			isClaimed: false,
			isDone: false,
			cost: 300,
			timer: '10:23:15',
		},
		{
			key: 4,
			title: 'Post your first private question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
		{
			key: 5,
			title: 'Answer your first public question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
		{
			key: 6,
			title: 'Answer your first private question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
		{
			key: 7,
			title: 'Add three tags to your question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
		{
			key: 8,
			title: 'Put a reaction to the question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
		{
			key: 9,
			title: 'Put a report to the question.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
		{
			key: 10,
			title: 'Add your first comment.',
			isClaimed: false,
			isDone: false,
			cost: 400,
			timer: '10:23:15',
		},
	];

	const [tasks, setTasks] = useState(tasksData);
	const visibleTasks = tasks.filter((task) => !task.isClaimed);
	// Обработка кнопки GO
	const handleGo = (taskKey) => {
		setTimeout(() => {
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.key === taskKey
						? { ...task, isDone: true } // Устанавливаем isDone в true через 10 секунд
						: task
				)
			);
		}, 1000); // Задержка 10 секунд
	};
	// Обработка кнопки Claim
	const handleClaim = (taskKey) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.key === taskKey
					? { ...task, isClaimed: true } // Устанавливаем isClaimed в true
					: task
			)
		);
	};

	return (
		<div className='tasks-page'>
			<h2 className='title mb--22 ask-page__title'>Tasks</h2>
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
								<h2 className='lh--140 tasks-page__title'>{element.title}</h2>

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
