import { useState } from 'react';
import { ProfileIcon } from '../../constants/SvgIcons';
import './header.sass';

const Header = () => {
	const [curItem, setItem] = useState('');

	return (
		<header className='header'>
			<div className='header__profile'>
				<div className='balance'>
					<span>293 TON</span>
				</div>
				<div className='profile'>
					<div
						className={`profile__button ${curItem ? 'active' : ''}`}
						onClick={() => setItem('active')}
					>
						<ProfileIcon />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
