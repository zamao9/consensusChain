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

	return (
		<div className='friends-page'>
			{/* Title */}
			<h2 className='title mb--22'>Friends</h2>

			{/* Friends list */}
			<ul className='friends-page__list'>
				{/* Friends list item */}
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
									<div className='user__name friends-page__user-name'>{element.userName}</div>
								</div>

								{/* Wrapper for icon and counter */}
								<div className='icon-counter mt--16'>
									<div className='icon-counter__icon'>
										<StarIcon />
									</div>

									{/* Comments count */}
									<span className='icon-counter__counter icon-counter__counter-right'>
										{element.userRating}
									</span>
								</div>
							</div>

							{/* Message, Delete wrapper */}
							<div className='friends-page__links-wrapper'>
								{/* Link Message */}
								<button
									type='button'
									className='link friends-page__link-message'
									disabled={element.trash}
								>
									<MessageIcon />
								</button>

								{/* Link Trash */}
								<button
									type='button'
									className='link friends-page__link-trash'
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
											{/* Link Yes */}
											<motion.button
												initial={{ marginRight: 'calc( -35px - 8px )' }}
												animate={{ marginRight: 0 }}
												exit={{ marginRight: 'calc( -35px - 8px )' }}
												transition={{ ease: 'easeIn', duration: 0.1 }}
												type='button'
												className='link friends-page__link-yes'
												onClick={() => dispatch(removeFriend(element.id))}
											>
												<SuccessIcon />
											</motion.button>

											{/* Link No */}
											<button
												type='button'
												className='link friends-page__link-no'
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
