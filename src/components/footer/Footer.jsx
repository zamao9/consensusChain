import './footer.sass';
import { AnswersIcon, QuestionsIcon, TasksIcon } from '../../constants/SvgIcons';

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
			<ul className='button-wrapper footer__button-wrapper'>
				{footerItems.map((element) => (
					<li key={element.key}>
						<button
							className={`button ${element.className} ${curItem === element.label ? 'active' : ''}`}
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
		</footer>
	);
};

export default Footer;
