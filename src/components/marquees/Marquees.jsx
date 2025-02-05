import React, { useEffect, useRef } from 'react';

const Marquees = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		// List of questions
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

		// Get background colour from CSS
		const bgColor = getComputedStyle(document.body).backgroundColor;

		// Adjusting the canvas size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Animation parameters
		const fontSize = 16; // Font size
		const rows = Math.floor(canvas.height / fontSize); // Number of lines

		// Create an array of states for each row
		const rowStates = Array.from({ length: rows }, (_, i) => ({
			x: canvas.width + Math.random() * canvas.width, // Starting position outside the screen
			y: i, // Fixed string
			speed: Math.random() + 1, // Random speed for each line
			text: questions[Math.floor(Math.random() * questions.length)], // Random question
			isActive: true, // Flag indicating that the string is active
			nextSpawnTime: 0, // Time when you can create a new text
		}));

		// Drawing function
		const draw = () => {
			// Add a semi-transparent background for the ‘footprint’ effect
			ctx.fillStyle = bgColor; // Use the background colour of the page
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Drawing questions
			for (let i = 4; i < (rowStates.length - 3) / 2; i++) {
				const row = rowStates[i];

				if (!row.isActive) continue; // Skip inactive lines

				// Calculating the position
				const xPos = row.x;
				const yPos = row.y * 2 * fontSize;

				// Add a soft effect with shadows
				ctx.shadowColor = 'rgba(179, 179, 179, 0.5)'; // The colour of the shadow
				ctx.shadowBlur = 2; // Shadow blurring
				ctx.fillStyle = 'rgba(179, 179, 179, 0.1)'; // Translucent green colour
				ctx.font = `${fontSize}px montserrat`;
				ctx.fillText(row.text, xPos, yPos);
				ctx.shadowBlur = 0; // Resetting the shadow after rendering

				// Updating the position
				row.x -= row.speed; // Right-to-left traffic

				// If the text goes completely off the screen
				if (xPos + ctx.measureText(row.text).width < 0) {
					row.isActive = false; // Mark the line as inactive
					row.nextSpawnTime = Date.now() + Math.random(); // Delay before new text appears
				}
			}

			// Check if it is possible to create new text in free lines
			const now = Date.now();
			for (let i = 0; i < rowStates.length; i++) {
				const row = rowStates[i];
				if (!row.isActive && now >= row.nextSpawnTime) {
					row.x = canvas.width + ctx.measureText(row.text).width; // Off-screen.
					row.text = questions[Math.floor(Math.random() * questions.length)]; // A new random question
					row.speed = Math.random() + 1; // New random speed
					row.isActive = true; // Activate the line
				}
			}
		};

		// Animation
		const animate = () => {
			draw();
			requestAnimationFrame(animate);
		};
		animate();

		// Cleaning during unmounting
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
				zIndex: -1,
				pointerEvents: 'none',
			}}
		/>
	);
};

export default Marquees;
