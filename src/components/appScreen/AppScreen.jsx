import Footer from '../footer/Footer';
import Header from '../header/Header';
import Marquees from '../marquees/Marquees';
import AskPage from '../askPage/AskPage';
import './appScreen.sass';
import { useState } from 'react';
import QuestionsPage from '../questionsPage/QuestionsPage';
import TasksPage from '../tasksPage/TasksPage';
import CommentsPage from '../commentsPage/CommentsPage';
import ProfilePage from '../profilePage/ProfilePage';

const AppScreen = () => {
	const questionsItems = [
		{
			key: 1,
			title: 'How many dicks i can suck?',
			popular: true,
			tags: ['Health', 'Coast', 'Nature'],
			user: 'gugugaga',
			report: false,
			trace: false,
			like: false,
			likeCount: 93,
		},
		{
			key: 2,
			title: 'How many dicks can fit in my arsehole?',
			popular: true,
			tags: ['Education', 'Health', 'Philosophy'],
			user: 'jimineitron',
			report: false,
			trace: false,
			like: false,
			likeCount: 70,
		},
		{
			key: 3,
			title: 'Who killed Kenedy?',
			popular: false,
			tags: ['Policy', 'Education', 'History'],
			user: 'timbeam',
			report: false,
			trace: false,
			like: false,
			likeCount: 10,
		},
		{
			key: 4,
			title: 'Who can kill Putin?',
			popular: false,
			tags: ['Policy', 'Education', 'History'],
			user: 'foxy',
			report: false,
			trace: false,
			like: false,
			likeCount: 0,
		},
	];

	const [curItem, setItem] = useState('ask-page'); // активный элемент навигации
	const [curPage, setPage] = useState('ask-page'); // активная страница
	const [questionsItem, setQuestionsItem] = useState(null);

	return (
		<section className='section app-screen'>
			<div className='container app-screen__container'>
				{/* Marquees */}
				{/* <Marquees /> */}

				{/* Header */}
				<Header curItem={curItem} setItem={setItem} setPage={setPage} />

				{/* Страница Profile */}
				{curPage === 'profile-page' && <ProfilePage />}

				{/* Страница Ask */}
				{curPage === 'ask-page' && <AskPage />}

				{/* Страница Questions */}
				{curPage === 'questions-page' && (
					<QuestionsPage
						setPage={setPage}
						setItem={setItem}
						questionsItems={questionsItems}
						setQuestionsItem={setQuestionsItem}
					/>
				)}

				{/* Страница Tasks */}
				{curPage === 'tasks-page' && <TasksPage />}

				{/* Страница Comments */}
				{curPage === 'comments-page' && <CommentsPage questionsItem={questionsItem} />}

				{/* Footer */}
				<Footer curItem={curItem} setItem={setItem} setPage={setPage} />
			</div>
		</section>
	);
};

export default AppScreen;
