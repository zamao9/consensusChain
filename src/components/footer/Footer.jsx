import { AnswersIcon, QuestionsIcon, TasksIcon } from '../../constants/SvgIcons';
import './footer.sass';

const Footer = ({ curItem, setItem, setPage }) => {
	const footerItems = [
		{
			key: 1,
			label: 'ask-page',
			svg: <QuestionsIcon />,
		},
		{
			key: 2,
			label: 'questions-page',
			svg: <AnswersIcon />,
		},
		{
			key: 3,
			label: 'tasks-page',
			svg: <TasksIcon />,
		},
	];

	return (
		<footer className='footer'>
			{/* Footer Items */}
			<div className='footer__wrapper'>
				<ul className='footer__list'>
					{footerItems.map((element) => (
						<li
							key={element.key}
							className={`footer__items ${curItem === element.label ? 'active' : ''}`}
							onClick={() => {
								setItem(element.label);
								setPage(element.label);
							}}
						>
							{element.svg}
						</li>
					))}
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
