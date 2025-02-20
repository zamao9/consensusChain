import './friendsPage.sass';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon, MessageIcon, StarIcon, SuccessIcon, TrashIcon } from '../../constants/SvgIcons';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { filteredFriends } from '../../feature/friends/friendsSelector';
import {
	changeRating,
	changeTrash,
	removeFriend,
	setFriends,
} from '../../feature/friends/friendsSlice';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, transform } from 'framer-motion';

const FriendsPage = () => {
	const dispatch = useAppDispatch();
	const allFriends = useAppSelector(filteredFriends);
	const friendsList = useAppSelector(filteredFriends);
	useEffect(() => {
		dispatch(changeRating([1, 1000]));
	}, []);

	// useEffect(() => {
	// 	dispatch(setFriends(friendsList));
	// }, []);

	const [trash, setTrash] = useState(false);

	return (
		<div className='friends-page'>
			{/* Title */}
			<h2 className='title mb--22 lh--140'>Friends</h2>

			{/* Friends list */}
			<ul className='friends-page__list'>
				{/* Friends item */}
				<AnimatePresence>
					{friendsList.map((element) => (
						<motion.li
							initial={{ x: 0, opacity: 1 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -200, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className='friends-page__item'
							key={element.id}
						>
							{/* User, Rating wrapper */}
							<div className='friends-page__content'>
								{/* User */}
								<div className='user'>
									{/* Nickname */}
									<div className='user__name'>
										<span className='title fw--400 lh--140 user__title friends-page__user-title'>
											{element.userName}
										</span>
									</div>
								</div>

								{/* Rating */}
								<div className='rating'>
									{/* Comments button */}
									<div className='rating__icon'>
										<StarIcon />
									</div>

									{/* Comments count */}
									<span className='rating__counter'>{element.userRating}</span>
								</div>
							</div>

							{/* Message, Delete wrapper */}
							<div className='friends-page__links-wrapper'>
								{/* Message Link */}
								<button type='button' className='link' onClick={() => setTrash(false)}>
									<MessageIcon />
								</button>
								{/* Delete Link */}
								<button
									type='button'
									className='link friends-page__trash'
									disabled={element.trash}
									onClick={() => dispatch(changeTrash(element.id))}
								>
									<TrashIcon />
								</button>
								<AnimatePresence>
									{/* Selection */}
									{element.trash && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className='selection'
										>
											{/* Yes Link */}
											<motion.button
												initial={{ marginRight: 'calc( -35px - 8px )' }}
												animate={{ marginRight: 0 }}
												exit={{ marginRight: 'calc( -35px - 8px )' }}
												transition={{ ease: 'easeIn', duration: 0.1 }}
												type='button'
												className='link selection__link selection__link-yes'
												onClick={() => dispatch(removeFriend(element.id))}
											>
												<SuccessIcon />
											</motion.button>

											{/* No Link */}
											<button
												type='button'
												className='link selection__link'
												onClick={() => dispatch(changeTrash(element.id))}
											>
												<CloseIcon />
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</div>
	);
};

export default FriendsPage;
