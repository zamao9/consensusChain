import React, { useEffect, useRef } from 'react';

const Marquees = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		// Настройка размеров холста
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Параметры анимации
		const fontSize = 16; // Размер цифр
		const speed = 2; // Скорость движения (пикселей за кадр)
		const rows = Math.floor(canvas.height / fontSize); // Количество строк
		const columns = Math.ceil(canvas.width / fontSize); // Количество столбцов

		// Создаем массив позиций для каждой строки
		const positions = Array.from({ length: rows }, () => ({
			x: Math.random() * canvas.width, // Начальная позиция по X
			y: Math.random() * rows, // Начальная позиция по Y
			speed: Math.random() * 2 + 1, // Случайная скорость для каждой строки
		}));

		// Функция отрисовки
		const draw = () => {
			// Добавляем полупрозрачный фон для эффекта "следа"
			ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Увеличиваем прозрачность фона
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Отрисовываем цифры
			ctx.fillStyle = '#0F0'; // Цвет цифр
			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < positions.length; i++) {
				const { x, y, speed: rowSpeed } = positions[i];

				// Генерируем случайную цифру
				const digit = Math.floor(Math.random() * 10);

				// Рассчитываем позицию
				const xPos = x;
				const yPos = y * fontSize;

				// Отрисовываем цифру
				ctx.fillText(digit, xPos, yPos);

				// Обновляем позицию
				positions[i].x += rowSpeed;

				// Если цифра выходит за пределы экрана, возвращаем ее в начало
				if (xPos > canvas.width) {
					positions[i].x = -fontSize;
					positions[i].y = Math.random() * rows; // Новая случайная строка
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
				height: 'calc(100vh + 120px)',
				zIndex: -1, // Размещаем за основным контентом
				pointerEvents: 'none', // Делаем холст невзаимодействуемым
			}}
		/>
	);
};

export default Marquees;
