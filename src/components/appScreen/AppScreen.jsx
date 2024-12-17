import Footer from '../footer/Footer';
import Header from '../header/Header';
import Marquees from '../marquees/Marquees';
import QuestionPage from '../questionPage/QuestionPage';
import './appScreen.sass';
import { useState } from 'react';

const AppScreen = () => {
	const [curItem, setItem] = useState('questions');

	return (
		<section className='section app-screen'>
			<div className='container app-screen__container'>
				{/* Marquees */}
				{/* <Marquees /> */}

				{/* Header */}
				<Header />

				{/* Question Page */}
				<QuestionPage />

				{/* Footer */}
				<Footer curItem={curItem} setItem={setItem} />
			</div>
		</section>
	);
};

export default AppScreen;
