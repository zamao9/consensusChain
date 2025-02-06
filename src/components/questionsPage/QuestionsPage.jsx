import './questionsPage.sass';
import React, { useState, useEffect } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
} from '../../constants/SvgIcons';
import QuestionsItem from './questionsItem/QuestionsItem';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import {
	selectCurrentPage,
	selectCurrentQuestionPageList,
	selectTotalPages,
} from '../../feature/questions/questionsSelector';
import { setCurrentPage, setQuestions } from '../../feature/questions/questionsSlice';
import Preloader from '../preloader/Preloader';
import { selectUserId } from '../../feature/profile/profileSelector';

const QuestionsPage = ({ setItem, setPage, setPopup, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [tab, setTab] = useState('first');

	// Function for receiving user questions
	const fetchQuestions = async (userId, allQuestions) => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${userId}?allQuestions=${allQuestions}`
			);
			if (!response.ok) throw new Error('Failed to fetch questions');
			const questions = await response.json();

			// Setting up questions in Redux
			dispatch(setQuestions(questions));

			setData(questions); // Keeping questions local
		} catch (error) {
			console.error('Error fetching questions:', error);
		} finally {
			setIsLoading(false); // Finishing the download
		}
	};

	// Getting questions when userId changes
	useEffect(() => {
		if (userId) {
			setIsLoading(true);
			if (tab === 'first') {
				fetchQuestions(userId, true); // Getting questions when userId changes
			} else if (tab === 'third') {
				fetchQuestions(userId, false);
			}
		}
		return () => {
			dispatch(setCurrentPage(1));
		};
	}, [userId, tab]);

	// Retrieving data from storage
	const currentPage = useAppSelector(selectCurrentPage);
	const displayedQuestions = useAppSelector(selectCurrentQuestionPageList);
	const totalPages = useAppSelector(selectTotalPages);
	// Functions for switching between pages
	const goToFirstPage = () => dispatch(setCurrentPage(1));
	const goToLastPage = () => dispatch(setCurrentPage(totalPages));
	const goToNextPage = () => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
	const goToPreviousPage = () => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));

	return (
		<div className='questions-page'>
			{isLoading ? (
				<Preloader
					isVisible={isLoading}
					color='#CECECE'
					size={60}
					message='Please wait, fetching data...'
				/>
			) : (
				// Если загрузка завершена (`isLoading` стало false), показываем загруженные данные.
				<>
					{/* Tabs */}
					<ul className='tabs mb--32'>
						{/* Tabs Item */}
						<li>
							<button
								className={`button tabs__item ${tab === 'first' ? 'active' : ''}`}
								onClick={() => setTab('first')}
							>
								All
							</button>
						</li>

						{/* Tabs Item */}
						{/* <li>
							<button
								className={`button tabs__item ${tab === 'second' ? 'active' : ''}`}
								onClick={() => setTab('second')}
							>
								Private
							</button>
						</li> */}

						{/* Tabs Item */}
						<li>
							<button
								className={`button tabs__item ${tab === 'third' ? 'active' : ''}`}
								onClick={() => setTab('third')}
							>
								Yours
							</button>
						</li>
					</ul>

					{/* List of questions */}
					<ul className=' mb--32 questions-page__list'>
						{/* Questions item */}
						{displayedQuestions.map((element, index) => (
							<QuestionsItem
								questionItem={element}
								comments={'questions-page'}
								setPopup={setPopup}
								setPopupText={setPopupText}
								setPopupSource={setPopupSource}
								setPage={setPage}
								setItem={setItem}
								isCurrentElement={false}
								key={element.question_id}
								animationDelay={index * 200} // Pass delay for animation
							/>
						))}
					</ul>

					{/* Pagination */}
					<div className='pagination'>
						<button
							className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
							onClick={goToFirstPage}
						>
							<DblArrowLeftIcon />
						</button>
						<button
							className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
							onClick={goToPreviousPage}
						>
							<ArrowLeftIcon />
						</button>

						{/* Page counter */}
						<div className='pagination__counter'>
							{currentPage} / {totalPages}
						</div>

						<button
							className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`}
							onClick={goToNextPage}
						>
							<ArrowRightIcon />
						</button>
						<button
							className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`}
							onClick={goToLastPage}
						>
							<DblArrowRightIcon />
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default QuestionsPage;
