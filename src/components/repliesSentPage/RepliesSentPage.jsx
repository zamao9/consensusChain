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
import { setCurrentPage } from '../../feature/repliesSent/RepliesSentSlice';
import { useEffect } from 'react';

const RepliesSentPage = () => {
	const dispatch = useAppDispatch();

	const totalPage = useAppSelector(selectTotalPage);
	const currentPageCommentsList = useAppSelector(selectCurrentPageCommentsList);
	const currentPage = useAppSelector(selectCurrentPage);

	const goToFirstPage = () => dispatch(setCurrentPage(1));
	const goToPreviousPage = () => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)));
	const goToNextPage = () => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPage)));
	const goToLastPage = () => dispatch(setCurrentPage(totalPage));

	useEffect(() => {
		dispatch(setCurrentPage(1));
	}, []);

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
						<p className='lh--140 replies-sent-page__text'>{element.text}</p>

						{/* Wrapper for Reactions, Links */}
						<div className='replies-sent-page__footer'>
							{/* Wrapper for Reactions */}
							<div className='replies-sent-page__reactions'>
								{/* Reactions */}
								<div className='replies-sent-page__reaction'>
									<LikeIcon />
									<span>{element.likes}</span>
								</div>

								{/* Reactions */}
								<div className='replies-sent-page__reaction'>
									<DislikeIcon />
									<span>{element.dislikes}</span>
								</div>
							</div>

							{/* Link */}
							<button className='replies-sent-page__link' onClick={element.link}>
								Go to
							</button>
						</div>
					</li>
				))}
			</ul>

			{/* Pagination */}
			<div className='pagination'>
				<button
					className={`pagination__button `}
					disabled={currentPage === 1}
					onClick={() => goToFirstPage()}
				>
					<DblArrowLeftIcon />
				</button>
				<button
					className='pagination__button '
					disabled={currentPage === 1}
					onClick={() => goToPreviousPage()}
				>
					<ArrowLeftIcon />
				</button>

				{/* Page counter */}
				<div className='pagination__counter'>{`${currentPage} / ${totalPage}`}</div>

				<button
					className={`pagination__button `}
					onClick={() => goToNextPage()}
					disabled={currentPage === totalPage}
				>
					<ArrowRightIcon />
				</button>
				<button
					className={`pagination__button `}
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
