import { AnswersIcon, QuestionsIcon, TasksIcon } from '../../constants/SvgIcons';
import './footer.sass';

const Footer = ({ curItem, setItem, setPage }) => {
	const footerItems = [
		{
			key: 1,
			label: 'ask-page',
			className: 'footer-item1',
			svg: <QuestionsIcon />,
		},
		{
			key: 2,
			label: 'questions-page',
			className: 'footer-item2',
			svg: <AnswersIcon />,
		},
		{
			key: 3,
			label: 'tasks-page',
			className: 'footer-item3',
			svg: <TasksIcon />,
		},
	];

	return (
		<footer className='footer'>
			{/* Footer Items */}
			<div className='footer__wrapper'>
				<ul className='footer__list'>
					{footerItems.map((element) => (
						<li key={element.key}>
							<button
								className={`footer__item ${element.className} ${
									curItem === element.label ? 'active' : ''
								}`}
								onClick={() => {
									setItem(element.label);
									setPage(element.label);
								}}
							>
								{element.svg}
							</button>
						</li>
					))}
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
