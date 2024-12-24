import { DislikeIcon, LikeIcon } from '../../constants/SvgIcons';
import QuestionsItem from '../questionsPage/questionsItem/QuestionsItem';
import './commentsPage.sass';

const CommentsPage = ({ questionsItem, setPopup }) => {
	return (
		<div className='comments-page'>
			{/* Комментарий */}
			<QuestionsItem questionsItem={questionsItem} comments={'comments-page'} setPopup={setPopup} />

			{/* Ответы */}
			<div className='answers mt--16'>
				{/* Текст ответа */}
				<h2 className='answers__title lh--140 mb--16'>
					A human anus can stretch up to 7 inches. A raccoon can squeeze into a 4 inch hole, which
					means you can put two raccoons up your arse.
				</h2>

				{/* Обертка Лайков и Дизлайков */}
				<div className='reactions-counter mb--32'>
					<div className='reactions-counter__icon-wrapper'>
						<LikeIcon />
						<span className='reactions-counter__count'>15</span>
					</div>
					<div className='reactions-counter__icon-wrapper'>
						<DislikeIcon />
						<span className='reactions-counter__count'>4</span>
					</div>
				</div>

				{/* Свайпер Лайка и Дизлайка */}
				<div className='reactions'>
					<button type='button' className='reactions__button'>
						<LikeIcon />
					</button>
					<button type='button' className='reactions__button'>
						<DislikeIcon />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentsPage;
