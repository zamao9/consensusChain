import { AnswersIcon, QuestionsIcon, TasksIcon } from '../../constants/SvgIcons';
import './footer.sass';
import FooterItems from './footerItems/FooterItems';

const Footer = ({ curItem, setItem }) => {
	const footerItems = [
		{
			key: 1,
			label: 'questions',
			svg: <QuestionsIcon />,
		},
		{
			key: 2,
			label: 'answers',
			svg: <AnswersIcon />,
		},
		{
			key: 3,
			label: 'tasks',
			svg: <TasksIcon />,
		},
	];

	return (
		<footer className='footer'>
			{/* Footer Items */}
			<ul className='footer__list'>
				{footerItems.map((element) => (
					<FooterItems
						curItem={curItem}
						setItem={setItem}
						svg={element.svg}
						key={element.key}
						label={element.label}
					/>
				))}
			</ul>
		</footer>
	);
};

export default Footer;
