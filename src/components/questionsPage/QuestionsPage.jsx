import './questionsPage.sass';
import React, { useState, useEffect } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
	FilterIcon,
	SearchIcon,
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
import { AnimatePresence, motion } from 'framer-motion';

const QuestionsPage = ({ curItem, setItem, setPage, setPopup, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [tab, setTab] = useState('first');
	const [filterButton, setFilterButton] = useState(false); // click on filter button

	// Initialising the languages list
	const initialLanguage = [
		{
			id: 1,
			label: 'English',
			status: false,
		},
		{
			id: 2,
			label: 'French',
			status: false,
		},
		{
			id: 3,
			label: 'Russian',
			status: false,
		},
	];
	const [languageFilter, setLanguageFilter] = useState(initialLanguage);

	// Languages click handler
	const handleLanguageChange = (id) => {
		const updatedLanguages = languageFilter.map((lang) =>
			lang.id === id ? { ...lang, status: true } : { ...lang, status: false }
		);
		setLanguageFilter(updatedLanguages);
	};

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

	// When filtering is open, disallow scrolling
	useEffect(() => {
		if (filterButton) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [filterButton]);

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
					{/* Tabs and Filters wrapper */}
					<div className='tabs-filter-wrapper mb--32'>
						{/* Tabs */}
						<ul className='tabs'>
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

						{/* Filter button wrapper */}
						<div className='button-wrapper'>
							{/* Filter Button */}
							<button
								className={`button button-wrapper__button ${filterButton ? 'active' : ''}`}
								onClick={() => setFilterButton(!filterButton)}
							>
								<div className='filter-icon'>
									<div className='filter-icon__item'></div>
								</div>
							</button>
						</div>
					</div>

					{/* Questions filter wrapper */}
					{filterButton && (
						<AnimatePresence>
							<motion.div className='questions-page__filter'>
								{/* Search tag input */}
								<div className='input questions-page__input'>
									{/* Input */}
									<input placeholder='Find a tag' type='text' />

									{/* Icon */}
									<SearchIcon />
								</div>

								{/* Dividing line */}
								<hr />

								{/* Languages filter list */}
								<ul className='language-filter'>
									{/* Languages filter items */}
									{languageFilter.map((element) => (
										<li className='language-filter-item' key={element.id}>
											<button
												type='button'
												className={`filters-item ${element.status ? 'active' : ''}`}
												onClick={() => handleLanguageChange(element.id)}
											>
												{element.label}
											</button>
										</li>
									))}
								</ul>
							</motion.div>
						</AnimatePresence>
					)}

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
