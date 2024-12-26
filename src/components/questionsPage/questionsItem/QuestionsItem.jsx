import { useState } from 'react';
import {
	CommentsIcon,
	LikeIcon,
	NotificationIcon,
	ProfileIcon,
	ReportIcon,
	StarIcon,
} from '../../../constants/SvgIcons';

const QuestionsItem = ({
	setItem,
	questionsItem,
	setPage,
	setQuestionsItem,
	comments,
	setPopup,
	setPopupText,
	setPopupSource,
	answer,
}) => {
	const [report, setReport] = useState(false);
	const [trace, setTrace] = useState(false);
	const [like, setLike] = useState(false);

	return (
		<li className='questions-page__item'>
			{/* Флажок популярности вопроса */}
			{comments === 'questions-page' && (
				<div
					className={`button questions-page__button questions-page__popular ${
						questionsItem.popular === false ? 'none' : ''
					}`}
				>
					<StarIcon />
				</div>
			)}

			{/* Вопрос */}
			<h2 className='title lh--140 questions-page__title'>{questionsItem.title}</h2>

			{/* Список тэгов */}
			<ul className='tags'>
				{/* Тэги */}
				{questionsItem.tags.map((tag, key) => (
					<li className='tags__item' key={key}>
						{tag}
					</li>
				))}
			</ul>

			{/* Имя пользователя */}
			<div className='user questions-page__user'>
				<ProfileIcon />
				<span className='user__name'>{questionsItem.user}</span>
			</div>

			{/* Обертка кнопок */}
			<div className='questions-page__buttons-wrapper'>
				{/* Обертка Репорта, Отслеживания, Лайков */}
				<div className='questions-page__buttons'>
					{/* Кнопка репорт */}
					<button
						type='button'
						className={`button questions-page__button questions-page__report ${
							report ? 'active' : ''
						}`}
						onClick={() => {
							setReport(!report);
							setPopup(true);
							setPopupText('Your report has been successfully sent.');
							setPopupSource('report-page');
						}}
					>
						<ReportIcon />
					</button>

					{/* Кнопка отслеживания */}
					<button
						type='button'
						className={`button questions-page__button questions-page__trace ${
							trace ? 'active' : ''
						}`}
						onClick={() => setTrace(!trace)}
					>
						<NotificationIcon />
					</button>

					{/* Обертка кнопки лайк */}
					<div className='questions-page__like-wrapper'>
						{/* Кнопка лайк */}
						<button
							type='button'
							className={`button questions-page__button questions-page__like ${
								like ? 'active' : ''
							}`}
							onClick={() => setLike(!like)}
						>
							<LikeIcon />
						</button>

						{/* Количество лайков */}
						<span className='questions-page__likeCount'>
							{like ? questionsItem.likeCount + 1 : questionsItem.likeCount}
						</span>
					</div>
				</div>

				{/* Кнопка комментариев */}
				{comments === 'questions-page' && (
					<button
						type='button'
						className='button questions-page__button questions-page__comments'
						onClick={() => {
							setPage('comments-page');
							setQuestionsItem(questionsItem);
							setItem('');
						}}
					>
						<CommentsIcon />
					</button>
				)}

				{/* Кнопка оставить комментарий */}
				{comments === 'comments-page' && (
					<button
						type='button'
						className='questions-page__button questions-page__leave-a-comment'
						disabled={answer}
						onClick={() => {
							setPopup(true);
							setPopupText('Your reply was successfully sent.');
							setPopupSource('answer');
						}}
					>
						Answer
					</button>
				)}
			</div>
		</li>
	);
};

export default QuestionsItem;
