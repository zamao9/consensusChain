import React, { useEffect, useRef } from 'react';

const Marquees = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		// Устанавливаем размеры canvas
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const fontSize = 12; // Размер символа
		const totalHeight = canvas.height * 0.7; // 70% высоты экрана
		const verticalPadding = canvas.height * 0.15; // 15% отступы сверху и снизу
		const rows = Math.floor(totalHeight / fontSize); // Количество строк в 70% области
		const horizontalPadding = 1; // Отступы слева и справа

		// Инициализируем массив с начальными горизонтальными позициями
		const positions = Array.from({ length: rows }, () =>
			Math.floor(Math.random() * ((canvas.width - horizontalPadding) / fontSize))
		);

		const draw = () => {
			// Затираем предыдущий кадр с эффектом затухания
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Устанавливаем стиль символов
			ctx.fillStyle = '#0F0'; // Зелёный цвет символов
			ctx.font = `${fontSize}px monospace`;

			// Рисуем символы
			for (let i = 0; i < positions.length; i++) {
				const text = String.fromCharCode(0x30a0 + Math.random() * 96);
				const x = positions[i] * fontSize + horizontalPadding; // Позиция по горизонтали
				const y = i * fontSize + verticalPadding; // Позиция по вертикали с учётом отступов

				ctx.fillText(text, x, y);

				// Логика движения символов: сбрасываем символ на левый край при выходе за правый отступ
				if (x > canvas.width - horizontalPadding && Math.random() > 0.975) {
					positions[i] = 0;
				}

				// Двигаем символ вправо
				positions[i]++;
			}
		};

		// Анимация через requestAnimationFrame
		const animate = () => {
			draw();
			requestAnimationFrame(animate);
		};

		animate(); // Запуск анимации

		return () => cancelAnimationFrame(animate); // Очистка при размонтировании компонента
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				display: 'block',
			}}
		/>
	);
};

export default Marquees;
