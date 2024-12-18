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
	];

	const [curButton, setButton] = useState(false);

	return (
		<div className='questions-page'>
			{/* Список вопросов */}
			<ul className='mb--32 questions-page__list'>
				{/* Элементы списка вопросов */}
				{questionsItems.map((element) => (
					<li className='questions-page__item' key={element.key}>
						{/* Флажок популярности вопроса */}
						<button
							type='button'
							className={`button questions-page__button questions-page__popular ${
								element.popular === false ? 'none' : '' //если popular: false, то скрывать
							}`}
						>
							<StartIcon />
						</button>
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
				<button className='pagination__button' onClick={() => console.log('first page')}>
					<DblArrowLeftIcon />
				</button>
				<button className='pagination__button' onClick={() => console.log('previous page')}>
					<ArrowLeftIcon />
				</button>

				{/* Счетчик страниц */}
				<div className='pagination__counter'>1 / 10</div>

				<button className='pagination__button' onClick={() => console.log('next page')}>
					<ArrowRightIcon />
				</button>
				<button className='pagination__button' onClick={() => console.log('last page')}>
					<DblArrowRightIcon />
				</button>
			</div>
		</div>
	);
};

export default QuestionsPage;
