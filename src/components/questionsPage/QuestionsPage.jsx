import { useState } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
} from '../../constants/SvgIcons';
import './questionsPage.sass';
import QuestionsItem from './questionsItem/QuestionsItem';

const QuestionsPage = ({ setItem, setPage, questionsItems, setQuestionsItem }) => {
	// Задаём стартовое состояние. страница 1
	const [currentPage, setCurrentPage] = useState(1);

	// Количество вопросов на странице
	const questionsPerPage = 3;

	// Подсчитать общее количество страниц
	const totalPages = Math.ceil(questionsItems.length / questionsPerPage);

	// Вычислить индекс первого и последнего элемента для текущей страницы что бы сразу по индексу переходить
	// Индекс начала
	const startIndex = (currentPage - 1) * questionsPerPage;
	// Индекс конца (не включается)
	const endIndex = startIndex + questionsPerPage;

	// Получить данные для текущей страницы. вначале это первые 3 записи
	const displayedQuestions = questionsItems.slice(startIndex, endIndex);

	// Функции для перехода между страницами
	// Перейти на первую страницу
	const goToFirstPage = () => setCurrentPage(1);
	// Перейти на последнюю страницу
	const goToLastPage = () => setCurrentPage(totalPages);
	// Следующая страница
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	// Предыдущая страница
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className='questions-page'>
			{/* Список вопросов */}
			<ul className='mb--32 questions-page__list'>
				{/* Элементы списка вопросов */}
				{displayedQuestions.map((element) => (
					<QuestionsItem
						questionsItem={element}
						setPage={setPage}
						setItem={setItem}
						key={element.key}
						setQuestionsItem={setQuestionsItem}
						comments={'questions-page'}
					/>
				))}
			</ul>

			{/* Пагинация */}
			<div className='pagination'>
				<button
					className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
					onClick={() => goToFirstPage()}
				>
					<DblArrowLeftIcon />
				</button>
				<button
					className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
					onClick={() => goToPreviousPage()}
				>
					<ArrowLeftIcon />
				</button>

				{/* Счетчик страниц */}
				<div className='pagination__counter'>
					{currentPage} / {totalPages}
				</div>

				<button
					className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`}
					onClick={() => goToNextPage()}
				>
					<ArrowRightIcon />
				</button>
				<button
					className={`pagination__button ${currentPage === totalPages ? 'disabled' : ''}`}
					onClick={() => goToLastPage()}
				>
					<DblArrowRightIcon />
				</button>
			</div>
		</div>
	);
};

export default QuestionsPage;
