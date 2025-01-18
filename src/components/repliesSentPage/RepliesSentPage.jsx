import { link } from 'framer-motion/client';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
	DislikeIcon,
	LikeIcon,
} from '../../constants/SvgIcons';
import './repliesSentPage.sass';
import { useAppSelector } from '../../hooks/store';
import { selectCurrentPage } from '../../feature/questions/questionsSelector';

const RepliesSentPage = () => {
	const currentPage = useAppSelector(selectCurrentPage);

	// структура отправленных ответов
	const RepliesSentData = [
		{
			id: 1,
			text: 'One guy shoves exactly one can into his rectum.',
			likes: 7,
			dislikes: 9,
			link: () => {
				console.log('link1');
			},
		},
		{
			id: 2,
			text: 'A human anus can stretch up to 7 inches. A raccoon can squeeze into a 4 inch hole, which means you can put two raccoons up your arse.',
			likes: 16,
			dislikes: 4,
			link: () => {
				console.log('link2');
			},
		},
		{
			id: 3,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
			link: () => {
				console.log('link3');
			},
		},
	];

	return (
		<div className='replies-sent-page'>
			<h2 className='title mb--22'>Replies Sent</h2>
			{/* Список элементов отправленных ответов */}
			<ul className='replies-sent-page__list mb--32'>
				{/* Элементы списка отправленных ответов */}
				{RepliesSentData.map((element) => (
					<li className='replies-sent-page__item' key={element.id}>
						{/* Текст элементов */}
						<p className='lh--140 replies-sent-page__text'>{element.text}</p>

						{/* Обертка Реакций, Ссылки */}
						<div className='replies-sent-page__footer'>
							{/* Обертка Реакций */}
							<div className='replies-sent-page__reactions'>
								{/* Реакция */}
								<div className='replies-sent-page__reaction'>
									<LikeIcon />
									<span>{element.likes}</span>
								</div>
								{/* Реакция */}
								<div className='replies-sent-page__reaction'>
									<DislikeIcon />
									<span>{element.dislikes}</span>
								</div>
							</div>

							{/* Ссылка */}
							<button className='replies-sent-page__link' onClick={element.link}>
								Go to
							</button>
						</div>
					</li>
				))}
			</ul>

			{/* Пагинация */}
			<div className='pagination'>
				<button
					className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
					onClick={() => console.log('first')}
				>
					<DblArrowLeftIcon />
				</button>
				<button
					className={`pagination__button ${currentPage === 1 ? 'disabled' : ''}`}
					onClick={() => console.log('prev')}
				>
					<ArrowLeftIcon />
				</button>

				{/* Счетчик страниц */}
				<div className='pagination__counter'>1 / 3</div>

				<button className={`pagination__button `} onClick={() => console.log('next')}>
					<ArrowRightIcon />
				</button>
				<button className={`pagination__button `} onClick={() => console.log('last')}>
					<DblArrowRightIcon />
				</button>
			</div>
		</div>
	);
};

export default RepliesSentPage;
