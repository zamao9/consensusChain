import React, { useState, useEffect } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
} from '../../constants/SvgIcons';
import './questionsPage.sass';
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

const QuestionsPage = ({
	tab,
	setTab,
	setItem,
	setPage,
	setQuestionsItem,
	setPopup,
	setPopupText,
	currSubmitBtn,
	setPopupSource,
}) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);

	// Функция для получения вопросов пользователя
	const fetchQuestions = async (userId) => {
		try {
			const response = await fetch(
				`https://web-production-c0b1.up.railway.app/questions/${userId}`
			);
			if (!response.ok) throw new Error('Failed to fetch questions');
			const questions = await response.json();

			//console.log(questions);

			// Устанавливаем вопросы в Redux
			dispatch(setQuestions(questions));

			setData(questions); // Сохраняем вопросы в локальном состоянии
		} catch (error) {
			console.error('Error fetching questions:', error);
		} finally {
			setIsLoading(false); // Заканчиваем загрузку
		}
	};

	// Получаем вопросы при изменении userId
	useEffect(() => {
		if (userId) {
			setIsLoading(true);
			fetchQuestions(userId); // Вызываем функцию для получения вопросов
		}
	}, [userId]);

	// Получение данных из хранилища
	const currentPage = useAppSelector(selectCurrentPage);
	const displayedQuestions = useAppSelector(selectCurrentQuestionPageList);
	const totalPages = useAppSelector(selectTotalPages);
	// Функции для перехода между страницами
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
					<ul className='tabs mb--32'>
						<li>
							<button
								className={`button tabs__item ${tab === 'first' ? 'active' : ''}`}
								onClick={() => setTab('first')}
							>
								All
							</button>
						</li>
						<li>
							<button
								className={`button tabs__item ${tab === 'second' ? 'active' : ''}`}
								onClick={() => setTab('second')}
							>
								Private
							</button>
						</li>
						<li>
							<button
								className={`button tabs__item ${tab === 'third' ? 'active' : ''}`}
								onClick={() => setTab('third')}
							>
								Yours
							</button>
						</li>
					</ul>

					{/* Список вопросов */}
					<ul className=' mb--32 questions-page__list'>
						{displayedQuestions.map((element) => (
							<QuestionsItem
								questionItem={element}
								isCurrentElement={false}
								setPage={setPage}
								setItem={setItem}
								key={element.question_id}
								comments={'questions-page'}
								setPopup={setPopup}
								setPopupText={setPopupText}
								setPopupSource={setPopupSource}
								currSubmitBtn={currSubmitBtn}
							/>
						))}
					</ul>

					{/* Пагинация */}
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

						{/* Счетчик страниц */}
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
			{/* Табы */}
		</div>
	);
};

export default QuestionsPage;
