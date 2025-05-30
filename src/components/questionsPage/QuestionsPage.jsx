import './questionsPage.sass';
import React, { useState, useEffect, useRef } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
	FilterIcon,
	SearchInputIcon,
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
	//const [data, setData] = useState(null);
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

	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState('English');

	// Retrieving data from storage
	const currentPage = useAppSelector(selectCurrentPage);
	const displayedQuestions = useAppSelector((state) =>
		selectCurrentQuestionPageList(state, selectedTags, selectedLanguage)
	);

	const totalPages = useAppSelector((state) =>
		selectTotalPages(state, selectedTags, selectedLanguage)
	);
	//console.log(displayedQuestions)

	const formatTag = (tag) => {
		if (!tag) return '';
		return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
	};

	// Languages click handler
	const handleLanguageChange = (id) => {
		const updatedLanguages = languageFilter.map((lang) =>
			lang.id === id ? { ...lang, status: true } : { ...lang, status: false }
		);
		setLanguageFilter(updatedLanguages);

		// Находим выбранный язык
		const selectedLang = updatedLanguages.find((lang) => lang.status)?.label || '';
		setSelectedLanguage(selectedLang);
	};

	const handleTagSearch = (tags) => {
		const formattedTags = tags
			.map((tag) => formatTag(tag.trim())) // Форматируем каждый тег
			.filter((tag) => tag); // Убираем пустые значения
		setSelectedTags(formattedTags); // Устанавливаем отформатированные теги
	};

	const [isFiltering, setIsFiltering] = useState(false);

	// Function for receiving user questions
	const fetchQuestions = async (userId, allQuestions) => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${userId}?allQuestions=${allQuestions}`
			);
			if (!response.ok) throw new Error('Failed to fetch questions');
			const questions = await response.json();
			console.log(questions);
			// Setting up questions in Redux
			dispatch(setQuestions(questions));

			//setData(questions); // Keeping questions local
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
				setFilterButton(false);
			} else if (tab === 'third') {
				fetchQuestions(userId, false);
				setFilterButton(false);
			}
		}
		return () => {
			dispatch(setCurrentPage(1));
		};
	}, [userId, tab]);

	// Functions for switching between pages
	const goToFirstPage = () => {
		dispatch(setCurrentPage(1));
		setFilterButton(false);
	};
	const goToLastPage = () => {
		dispatch(setCurrentPage(totalPages));
		setFilterButton(false);
	};
	const goToNextPage = () => {
		dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
		setFilterButton(false);
	};
	const goToPreviousPage = () => {
		dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
		setFilterButton(false);
	};

	// Click outside of an element makes filter button and wrapper close
	const filterWrapper = useRef(null);
	const handleCLickOutsideFilterWrapper = () => {
		if (filterWrapper.current && !filterWrapper.current.contains(event.target)) {
			setFilterButton(false);
		}
	};

	// When filtering is open, disallow scrolling
	useEffect(() => {
		if (filterButton) {
			document.body.classList.add('no-scroll');
			document.addEventListener('mousedown', handleCLickOutsideFilterWrapper);
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [filterButton]);

	useEffect(() => {
		// Имитация задержки фильтрации
		setIsFiltering(true);
		setTimeout(() => {
			setIsFiltering(false);
		}, 300); // Задержка в 300 мс
	}, [selectedTags, selectedLanguage]);

	const tagsFilter = [
		{ id: 1, label: 'Asfaaasfafasfasa' },
		{ id: 2, label: 'Sasfas' },
		{ id: 3, label: 'Fafaasfa' },
	];

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
				<>
					{/* Tabs and Filters wrapper */}
					<div className='button-wrapper mb--32'>
						{/* Tabs */}
						<ul className='tabs'>
							<li>
								<button
									className={`tabs__item ${tab === 'first' ? 'active' : ''}`}
									onClick={() => setTab('first')}
								>
									All
								</button>
							</li>
							<li>
								<button
									className={`tabs__item ${tab === 'third' ? 'active' : ''}`}
									onClick={() => setTab('third')}
								>
									Yours
								</button>
							</li>
						</ul>

						{/* Filter button wrapper */}
						<button
							className={`button ${filterButton ? 'active' : ''}`}
							onClick={() => setFilterButton(true)}
							disabled={filterButton}
						>
							<FilterIcon />
						</button>
					</div>

					{/* Questions filter wrapper */}
					{filterButton && (
						<AnimatePresence>
							<search>
								<form>
									<motion.div
										className='questions-page__filter-wrapper'
										ref={filterWrapper}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										{/* Search tag input */}
										<div className='input input-relative'>
											<input
												placeholder='Find a tag'
												type='text'
												onChange={(e) => handleTagSearch(e.target.value.split(','))}
											/>
											<SearchInputIcon />
										</div>

										{/* Filter tags */}
										<ul className='tags'>
											{tagsFilter.map((element) => (
												<li key={element.id}>
													<button type='button' className='link tags__item tags__item-filter'>
														{element.label}
														<div className='tags__item-delete'>
															<CloseIcon />
														</div>
													</button>
												</li>
											))}
										</ul>

										{/* Dividing line */}
										<hr />

										{/* Filter list */}
										<ul className='filters-list'>
											{languageFilter.map((element) => (
												<li key={element.id}>
													<button
														type='button'
														className={`button filters-list__button ${
															element.status ? 'active' : ''
														}`}
														onClick={() => handleLanguageChange(element.id)}
													>
														{element.label}
													</button>
												</li>
											))}
										</ul>
									</motion.div>
								</form>
							</search>
						</AnimatePresence>
					)}

					{/* Preloader for filtering */}
					{isFiltering && (
						<Preloader
							isVisible={isFiltering}
							color='#CECECE'
							size={40}
							message='Filtering questions...'
						/>
					)}

					{/* List of questions */}
					<section className='mb--32 questions-page__list'>
						{displayedQuestions.map((element, index) => (
							<QuestionsItem
								key={element.question_id}
								questionItem={element}
								comments={'questions-page'}
								setPopup={setPopup}
								setPopupText={setPopupText}
								setPopupSource={setPopupSource}
								setPage={setPage}
								setItem={setItem}
								isCurrentElement={false}
								animationDelay={index * 200}
							/>
						))}
					</section>

					{/* Pagination */}
					<div className='button-wrapper pagination'>
						<button
							className='button pagination__button'
							onClick={goToFirstPage}
							disabled={currentPage - 1 < 1}
						>
							<DblArrowLeftIcon />
						</button>
						<button
							className='button pagination__button'
							onClick={goToPreviousPage}
							disabled={currentPage - 1 < 1}
						>
							<ArrowLeftIcon />
						</button>
						<div className='pagination__counter'>
							{currentPage > totalPages ? '0' : currentPage} / {totalPages}
						</div>
						<button
							className='button pagination__button'
							onClick={goToNextPage}
							disabled={currentPage + 1 > totalPages}
						>
							<ArrowRightIcon />
						</button>
						<button
							className='button pagination__button'
							onClick={goToLastPage}
							disabled={currentPage + 1 > totalPages}
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
