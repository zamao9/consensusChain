import React, { useEffect, useRef } from 'react';

const Marquees = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		// Список вопросов
		const questions = [
			"What are the core goals of Consensus Chain in the next six months?",
			"How does the token distribution system work within the app?",
			"What measures will be taken to ensure the security of user data and token transactions?",
			"How will the AI integrate with the tokenomics of the project?",
			"What are the challenges we might face when scaling the platform globally?",
			"How do we plan to engage with users to ensure long-term participation?",
			"What are the main incentives for early adopters of the app?",
			"How will we handle and resolve disputes regarding questions and answers?",
			"What are the benefits of the community-driven approach in our platform?",
			"What future partnerships or integrations are we looking into to enhance the app?"
		];

		// Получаем цвет фона из CSS
		const bgColor = getComputedStyle(document.body).backgroundColor;

		// Настройка размеров холста
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Параметры анимации
		const fontSize = 16; // Размер шрифта
		const rows = Math.floor(canvas.height / fontSize); // Количество строк

		// Создаем массив позиций для каждой строки
		const positions = Array.from({ length: rows }, () => ({
			x: Math.random() * canvas.width, // Начальная позиция по X
			y: Math.random() * rows, // Начальная позиция по Y
			speed: Math.random() * 4 + 1, // Случайная скорость для каждой строки
			text: questions[Math.floor(Math.random() * questions.length)] // Случайный вопрос
		}));

		// Функция отрисовки
		const draw = () => {
			// Добавляем полупрозрачный фон для эффекта "следа"
			ctx.fillStyle = bgColor; // Используем цвет фона страницы
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Отрисовываем вопросы
			ctx.fillStyle = '#0F0'; // Цвет текста
			ctx.font = `${fontSize}px monospace`;
			for (let i = 0; i < positions.length; i++) {
				const { x, y, speed: rowSpeed, text } = positions[i];
				// Рассчитываем позицию
				const xPos = x;
				const yPos = y * fontSize;
				// Отрисовываем текст
				ctx.fillText(text, xPos, yPos);
				// Обновляем позицию
				positions[i].x += rowSpeed;
				// Если текст выходит за пределы экрана, возвращаем его в начало
				if (xPos > canvas.width) {
					positions[i].x = -ctx.measureText(text).width; // Учитываем длину текста
					positions[i].y = Math.random() * rows; // Новая случайная строка
					positions[i].text = questions[Math.floor(Math.random() * questions.length)]; // Новый случайный вопрос
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
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: '100%',
				height: '100%',
				zIndex: -1, // Размещаем за основным контентом
				pointerEvents: 'none', // Делаем холст невзаимодействуемым
			}}
		/>
	);
};

export default Marquees;