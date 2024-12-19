import Footer from '../footer/Footer';
import Header from '../header/Header';
import Marquees from '../marquees/Marquees';
import AskPage from '../askPage/AskPage';
import './appScreen.sass';
import { useState } from 'react';
import QuestionsPage from '../questionsPage/QuestionsPage';
import TasksPage from '../tasksPage/TasksPage';

const AppScreen = () => {
	const [curItem, setItem] = useState('ask-page'); // активный элемент навигации
	const [curPage, setPage] = useState('ask-page'); // активная страница

	return (
		<section className='section app-screen'>
			<div className='container app-screen__container'>
				{/* Marquees */}
				{/* <Marquees /> */}

				{/* Header */}
				<Header curItem={curItem} setItem={setItem} />

				{/* Страница Ask */}
				{curPage === 'ask-page' && <AskPage />}
				{/* Страница Questions */}
				{curPage === 'questions-page' && <QuestionsPage />}
				{/* Страница Tasks */}
				{curPage === 'tasks-page' && <TasksPage />}

				{/* Footer */}
				<Footer curItem={curItem} setItem={setItem} setPage={setPage} />
			</div>
		</section>
	);
};

export default AppScreen;
