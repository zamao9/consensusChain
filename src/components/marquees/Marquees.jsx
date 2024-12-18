import React, { useEffect, useRef } from 'react';

const Marquees = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const fontSize = 16; // Размер символов
		const speed = 0.1; // Скорость движения символов (увеличь для ускорения)
		const verticalPadding = canvas.height * 0.15; // Отступ сверху и снизу (15% высоты экрана)
		const horizontalPadding = 1; // Отступ слева и справа (в пикселях)

		const totalHeight = canvas.height;
		const rows = Math.floor(totalHeight / fontSize);

		const positions = Array.from({ length: rows }, () => ({
			pos: Math.floor(Math.random() * ((canvas.width - horizontalPadding) / fontSize)),
			delay: Math.random() * 1000,
		}));

		const draw = () => {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#0F0';
			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < positions.length; i++) {
				const { pos, delay } = positions[i];

				if (delay > 0) {
					positions[i].delay -= 16;
					continue;
				}

				const text = String.fromCharCode(0x30a0 + Math.random() * 96);
				const x = pos * fontSize + horizontalPadding;
				const y = i * fontSize + verticalPadding;

				ctx.fillText(text, x, y);

				if (x > canvas.width - horizontalPadding && Math.random() > 0.975) {
					positions[i].pos = 0;
				}

				positions[i].pos += speed; // Движение символов
			}
		};

		const animate = () => {
			draw();
			requestAnimationFrame(animate);
		};

		animate();

		return () => cancelAnimationFrame(animate);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				maxWidth: '500px',
				maxHeight: '500px',
				display: 'block',
				background: 'transparent',
			}}
		/>
	);
};

export default Marquees;
