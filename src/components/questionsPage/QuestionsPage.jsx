import React from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
} from '../../constants/SvgIcons';
import './questionsPage.sass';
import QuestionsItem from './questionsItem/QuestionsItem';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectCurrentPage, selectCurrentQuestionPageList, selectQuestions, selectTotalPages } from '../../feature/questions/questionsSelector';
import { setCurrentPage } from '../../feature/questions/questionsSlice';


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
	// Получение данных из хранилища
	const currentPage = useAppSelector(selectCurrentPage);
	const displayedQuestions = useAppSelector(selectCurrentQuestionPageList);
	const totalPages = useAppSelector(selectTotalPages);

	// Функции для перехода между страницами
	const goToFirstPage = () => dispatch(setCurrentPage(1));
	const goToLastPage = () => dispatch(setCurrentPage(totalPages));
	const goToNextPage = () =>
		dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)));
	const goToPreviousPage = () =>
		dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));

	return (
		<div className="questions-page">
			{/* Табы */}
			<ul className="tabs mb--32">
				<li>
					<button
						className={`button tabs__item ${tab === 'first' ? 'active' : ''
							}`}
						onClick={() => setTab('first')}
					>
						All
					</button>
				</li>
				<li>
					<button
						className={`button tabs__item ${tab === 'second' ? 'active' : ''
							}`}
						onClick={() => setTab('second')}
					>
						Private
					</button>
				</li>
				<li>
					<button
						className={`button tabs__item ${tab === 'third' ? 'active' : ''
							}`}
						onClick={() => setTab('third')}
					>
						Yours
					</button>
				</li>
			</ul>

			{/* Список вопросов */}
			<ul className="mb--32 questions-page__list">
				{displayedQuestions.map((element) => (
					<QuestionsItem
						questionsItem={element}
						setPage={setPage}
						setItem={setItem}
						key={element.key}
						setQuestionsItem={setQuestionsItem}
						comments={'questions-page'}
						setPopup={setPopup}
						setPopupText={setPopupText}
						setPopupSource={setPopupSource}
						currSubmitBtn={currSubmitBtn}
					/>
				))}
			</ul>

			{/* Пагинация */}
			<div className="pagination">
				<button
					className={`pagination__button ${currentPage === 1 ? 'disabled' : ''
						}`}
					onClick={goToFirstPage}
				>
					<DblArrowLeftIcon />
				</button>
				<button
					className={`pagination__button ${currentPage === 1 ? 'disabled' : ''
						}`}
					onClick={goToPreviousPage}
				>
					<ArrowLeftIcon />
				</button>

				{/* Счетчик страниц */}
				<div className="pagination__counter">
					{currentPage} / {totalPages}
				</div>

				<button
					className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''
						}`}
					onClick={goToNextPage}
				>
					<ArrowRightIcon />
				</button>
				<button
					className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''
						}`}
					onClick={goToLastPage}
				>
					<DblArrowRightIcon />
				</button>
			</div>
		</div>
	);
};

export default QuestionsPage;
