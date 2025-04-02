import './repliesSentPage.sass';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	DblArrowLeftIcon,
	DblArrowRightIcon,
	DislikeIcon,
	LikeIcon,
} from '../../constants/SvgIcons';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import {
	selectCurrentPageCommentsList,
	selectTotalPage,
	selectCurrentPage,
} from '../../feature/repliesSent/repliesSentSelector';
import { setCurrentPage, setRepliesSent } from '../../feature/repliesSent/RepliesSentSlice';
import { useEffect } from 'react';
import { selectUserId } from '../../feature/profile/profileSelector';

const RepliesSentPage = () => {
	const dispatch = useAppDispatch();

	const totalPage = useAppSelector(selectTotalPage);
	const currentPageCommentsList = useAppSelector(selectCurrentPageCommentsList);
	console.log(currentPageCommentsList);

	const currentPage = useAppSelector(selectCurrentPage);
	const userId = useAppSelector(selectUserId);

	const goToFirstPage = () => dispatch(setCurrentPage(1));
	const goToPreviousPage = () => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
	const goToNextPage = () => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPage)));
	const goToLastPage = () => dispatch(setCurrentPage(totalPage));

	useEffect(() => {
		dispatch(setCurrentPage(1));
	}, []);

	useEffect(() => {
		const fetchaaaa = async () => {
			try {
				const response = await fetch(
					`https://web-production-c0b1.up.railway.app/questions/1/comments?user_id=${userId}&allComments=false`
				);
				if (!response.ok) throw new Error('Failed to fetch statistics');
				const data = await response.json();
				console.log(data);
				dispatch(setRepliesSent(data));
			} catch (error) {
				setError('Error fetching user statistics');
				console.error('Error fetching user statistics:', error);
			}
		};

		fetchaaaa();
	}, [userId, dispatch]);

	return (
		<div className='replies-sent-page'>
			{/* Title of sent replies */}
			<h2 className='title mb--22'>Replies Sent</h2>

			{/* List of sent reply items */}
			<ul className='replies-sent-page__list mb--32'>
				{/* Items in the list of sent replies */}
				{currentPageCommentsList.map((element) => (
					<li className='replies-sent-page__item' key={element.id}>
						{/* Element Text */}
						<p>{element.text}</p>

						{/* Wrapper for Reactions, Links */}
						<div className='replies-sent-page__footer'>
							{/* Reactions */}
							<ul className='reactions'>
								{/* Reactions item */}
								<li className='reactions__item'>
									<LikeIcon />
									<span>{element.likes}</span>
								</li>

								{/* Reactions item */}
								<li className='reactions__item'>
									<DislikeIcon />
									<span>{element.dislikes}</span>
								</li>
							</ul>

							{/* Link */}
							<button className='link replies-sent-page__link' onClick={element.link}>
								Go to
							</button>
						</div>
					</li>
				))}
			</ul>

			{/* Pagination */}
			<div className='button-wrapper pagination'>
				<button
					className='button pagination__button'
					disabled={currentPage === 1}
					onClick={() => goToFirstPage()}
				>
					<DblArrowLeftIcon />
				</button>
				<button
					className='button pagination__button '
					disabled={currentPage === 1}
					onClick={() => goToPreviousPage()}
				>
					<ArrowLeftIcon />
				</button>

				{/* Page counter */}
				<div className='pagination__counter'>{`${currentPage} / ${totalPage}`}</div>

				<button
					className='button pagination__button'
					onClick={() => goToNextPage()}
					disabled={currentPage === totalPage}
				>
					<ArrowRightIcon />
				</button>
				<button
					className='button pagination__button'
					onClick={() => goToLastPage()}
					disabled={currentPage === totalPage}
				>
					<DblArrowRightIcon />
				</button>
			</div>
		</div>
	);
};

export default RepliesSentPage;
