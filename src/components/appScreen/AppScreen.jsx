import Footer from '../footer/Footer';
import './appScreen.sass';
import { useState } from 'react';

const AppScreen = () => {
	const [curItem, setItem] = useState('questions');

	return (
		<section className='section app-screen'>
			<div className='container app-screen__container'>
				{/* Footer */}
				<Footer curItem={curItem} setItem={setItem} />
			</div>
		</section>
	);
};

export default AppScreen;
