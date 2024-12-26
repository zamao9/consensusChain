import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { DislikeIcon, LikeIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import './commentsPage.sass';

const CommentsPage = ({ questionsItem, setPopup, setPopupText, setPopupSource, answer }) => {
	const [answers, setAnswers] = useState([
		{
			id: 1,
			text: 'One guy shoves exactly one can into his rectum.',
			likes: 7,
			dislikes: 9,
		},
		{
			id: 2,
			text: 'A human anus can stretch up to 7 inches. A raccoon can squeeze into a 4 inch hole, which means you can put two raccoons up your arse.',
			likes: 16,
			dislikes: 4,
		},
		{
			id: 3,
			text: 'I guess, we’ll never know.',
			likes: 30,
			dislikes: 6,
		},
	]);

	const [currentIndex, setCurrentIndex] = useState(0);

	// Обработчики свайпов
	const handlers = useSwipeable({
		onSwipedLeft: () => handleReaction('dislike'),
		onSwipedRight: () => handleReaction('like'),
	});

	const handleReaction = (type) => {
		setAnswers((prevAnswers) => {
			const updatedAnswers = [...prevAnswers];
			if (type === 'like') {
				updatedAnswers[currentIndex].likes += 1;
			} else if (type === 'dislike') {
				updatedAnswers[currentIndex].dislikes += 1;
			}
			return updatedAnswers;
		});

		// Переход к следующему ответу
		if (currentIndex < answers.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			// Если ответы закончились
			setCurrentIndex(0);
		}
	};

	const resetAnswers = () => {
		setCurrentIndex(0);
	};

	return (
		<div className='comments-page'>
			{/* Комментарий */}
			<QuestionsItem
				questionsItem={questionsItem}
				comments={'comments-page'}
				setPopup={setPopup}
				setPopupText={setPopupText}
				setPopupSource={setPopupSource}
				answer={answer}
			/>

			{/* Ответы */}
			<div {...handlers} className='answers mt--16'>
				{/* Текст ответа */}
				<h2 className='answers__title lh--140 mb--16'>{answers[currentIndex].text}</h2>

				{/* Обертка Лайков и Дизлайков */}
				<div className='reactions-counter mb--32'>
					<div className='reactions-counter__icon-wrapper'>
						<LikeIcon />
						<span className='reactions-counter__count'>{answers[currentIndex].likes}</span>
					</div>
					<div className='reactions-counter__icon-wrapper'>
						<DislikeIcon />
						<span className='reactions-counter__count'>{answers[currentIndex].dislikes}</span>
					</div>
				</div>

				{/* Свайпер Лайка и Дизлайка */}
				<div className='reactions'>
					<button
						type='button'
						className='reactions__button'
						onClick={() => handleReaction('like')}
					>
						<LikeIcon />
					</button>
					<button
						type='button'
						className='reactions__button'
						onClick={() => handleReaction('dislike')}
					>
						<DislikeIcon />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentsPage;
