import { transform } from 'motion';
import React, { useEffect, useRef } from 'react';

const Marquees = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		// Список вопросов
		const questions = [
			'What are the core goals of Consensus Chain in the next six months?',
			'How does the token distribution system work within the app?',
			'What measures will be taken to ensure the security of user data and token transactions?',
			'How will the AI integrate with the tokenomics of the project?',
			'What are the challenges we might face when scaling the platform globally?',
			'How do we plan to engage with users to ensure long-term participation?',
			'What are the main incentives for early adopters of the app?',
			'How will we handle and resolve disputes regarding questions and answers?',
			'What are the benefits of the community-driven approach in our platform?',
			'What future partnerships or integrations are we looking into to enhance the app?',
		];

		// Получаем цвет фона из CSS
		const bgColor = getComputedStyle(document.body).backgroundColor;

		// Настройка размеров холста
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Параметры анимации
		const fontSize = 20; // Размер шрифта
		const rows = Math.floor(canvas.height / fontSize); // Количество строк

		// Создаем массив состояний для каждой строки
		const rowStates = Array.from({ length: rows }, (_, i) => ({
			x: canvas.width + Math.random() * canvas.width, // Начальная позиция за пределами экрана
			y: i, // Фиксированная строка
			speed: Math.random() + 1, // Случайная скорость для каждой строки
			text: questions[Math.floor(Math.random() * questions.length)], // Случайный вопрос
			isActive: true, // Флаг, указывающий, что строка активна
			nextSpawnTime: 0, // Время, когда можно создать новый текст
		}));
		console.log(rows);

		// Функция отрисовки
		const draw = () => {
			// Добавляем полупрозрачный фон для эффекта "следа"
			ctx.fillStyle = bgColor; // Используем цвет фона страницы
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Отрисовываем вопросы
			for (let i = 4; i < (rowStates.length - 3) / 2; i++) {
				const row = rowStates[i];

				if (!row.isActive) continue; // Пропускаем неактивные строки

				// Рассчитываем позицию
				const xPos = row.x;
				const yPos = row.y * 2 * fontSize;

				// Добавляем эффект мягкости с помощью теней
				ctx.shadowColor = 'rgba(179, 179, 179, 0.5)'; // Цвет тени
				ctx.shadowBlur = 2; // Размытие тени
				ctx.fillStyle = 'rgba(179, 179, 179, 0.1)'; // Полупрозрачный зелёный цвет
				ctx.font = `${fontSize}px montserrat`;
				ctx.fillText(row.text, xPos, yPos);
				ctx.shadowBlur = 0; // Сбрасываем тень после отрисовки

				// Обновляем позицию
				row.x -= row.speed; // Движение справа налево

				// Если текст полностью выходит за пределы экрана
				if (xPos + ctx.measureText(row.text).width < 0) {
					row.isActive = false; // Отмечаем строку как неактивную
					row.nextSpawnTime = Date.now() + Math.random(); // Задержка перед появлением нового текста
				}
			}

			// Проверяем, можно ли создать новый текст в свободных строках
			const now = Date.now();
			for (let i = 0; i < rowStates.length; i++) {
				const row = rowStates[i];
				if (!row.isActive && now >= row.nextSpawnTime) {
					row.x = canvas.width + ctx.measureText(row.text).width; // За пределами экрана
					row.text = questions[Math.floor(Math.random() * questions.length)]; // Новый случайный вопрос
					row.speed = Math.random() + 1; // Новая случайная скорость
					row.isActive = true; // Активируем строку
				}
			}
		};

		// Анимация
		const animate = () => {
			draw();
			requestAnimationFrame(animate);
		};
		animate();

		// Очистка при размонтировании
		return () => cancelAnimationFrame(animate);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: -1, // Размещаем за основным контентом
				pointerEvents: 'none', // Делаем холст невзаимодействуемым
			}}
		/>
	);
};

export default Marquees;
