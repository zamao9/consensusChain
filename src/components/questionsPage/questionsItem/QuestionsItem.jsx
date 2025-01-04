import { useDispatch, useSelector } from 'react-redux';
import {
	CommentsIcon,
	LikeIcon,
	NotificationIcon,
	ProfileIcon,
	ReportIcon,
	StarIcon,
} from '../../../constants/SvgIcons';
import { useAppDispatch } from '../../../hooks/store';
import { updateQuestion } from '../../../feature/questions/questionsSlice';

const QuestionsItem = ({
	questionsItem,
	comments,
	setPopup,
	setPopupText,
	setPopupSource,
	answer,
	setPage,
	setQuestionsItem,
	setItem,
}) => {
	const dispatch = useAppDispatch();

	// Обработчики событий
	const handleReport = () => {
		dispatch(
			updateQuestion({
				id: questionsItem.id,
				updates: { report: !questionsItem.report },
			})
		);
		setPopup(true);
		setPopupText('Your report has been successfully sent.');
		setPopupSource('report-page');
	};

	const handleTrace = () => {
		dispatch(
			updateQuestion({
				id: questionsItem.id,
				updates: { trace: !questionsItem.trace },
			})
		);
	};

	const handleLike = () => {
		dispatch(
			updateQuestion({
				id: questionsItem.id,
				updates: {
					like: !questionsItem.like,
					likeCount: questionsItem.like ? questionsItem.likeCount - 1 : questionsItem.likeCount + 1,
				},
			})
		);
	};

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
				{questionsItem.tags.map((tag, id) => (
					<li className='tags__item' key={id} id={id}>
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
							questionsItem.report ? 'active' : ''
						}`}
						onClick={handleReport}
					>
						<ReportIcon />
					</button>

					{/* Кнопка отслеживания */}
					<button
						type='button'
						className={`button questions-page__button questions-page__trace ${
							questionsItem.trace ? 'active' : ''
						}`}
						onClick={handleTrace}
					>
						<NotificationIcon />
					</button>

					{/* Обертка кнопки лайк */}
					<div className='questions-page__like-wrapper'>
						<button
							type='button'
							className={`button questions-page__button questions-page__like ${
								questionsItem.like ? 'active' : ''
							}`}
							onClick={handleLike}
						>
							<LikeIcon />
						</button>
						<span className='questions-page__likeCount'>{questionsItem.likeCount}</span>
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
