import { useState } from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CommentsIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
	LikeIcon,
	NotificationIcon,
	ReportIcon,
	StartIcon,
} from '../../constants/SvgIcons';
import './questionsPage.sass';

const QuestionsPage = () => {
	const questionsItems = [
		{
			key: 1,
			title: 'How many dicks i can suck?',
			popular: true,
			tags: ['Health', 'Coast', 'Nature'],
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
			report: false,
			trace: false,
			like: false,
			likeCount: 0,
		},
	];

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
					<li className='questions-page__item' key={element.key}>
						{/* Флажок популярности вопроса */}
						<div
							className={`button questions-page__button questions-page__popular ${
								element.popular === false ? 'none' : ''
							}`}
						>
							<StartIcon />
						</div>
						{/* Вопрос */}
						<h2 className='title questions-page__title'>{element.title}</h2>

						{/* Список тэгов */}
						<ul className='tags'>
							{/* Тэги */}
							{element.tags.map((tag, key) => (
								<li className='tags__item' key={key}>
									{tag}
								</li>
							))}
						</ul>

						{/* Обертка кнопок */}
						<div className='questions-page__buttons-wrapper'>
							{/* Обертка Репорта, Отсслеживания, Лайков */}
							<div className='questions-page__buttons'>
								{/* Кнопка репорт */}
								<button
									type='button'
									className='button questions-page__button questions-page__report'
								>
									{element.report}
									<ReportIcon />
								</button>

								{/* Кнопка отслеживания */}
								<button
									type='button'
									className='button questions-page__button questions-page__trace'
								>
									{element.trace}
									<NotificationIcon />
								</button>

								{/* Обертка кнопки лайк */}
								<div className='questions-page__like-wrapper'>
									{/* Кнопка лайк */}
									<button
										type='button'
										className='button questions-page__button questions-page__like'
									>
										{element.like}
										<LikeIcon />
									</button>

									{/* Количество лайков */}
									<span className='questions-page__likeCount'>{element.likeCount}</span>
								</div>
							</div>

							{/* Кнопка комментариев */}
							<button
								type='button'
								className='button questions-page__button questions-page__comments'
							>
								<CommentsIcon />
							</button>
						</div>
					</li>
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
