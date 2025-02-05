import { useState } from 'react';
import './reportPopup.sass';
import { ArrowLeftIcon } from '../../constants/SvgIcons';
import { setPopupText } from '../../feature/userInterface/userInterfaceSlice';
import { useAppDispatch } from '../../hooks/store';

const ReportPopup = ({ setPopupSource }) => {
	const dispatch = useAppDispatch();
	const reportFlow = [
		{
			id: 'ads',
			title: 'Сhoose a problem',
			tags: ['Advertisement', 'Insults', 'Other'],
			subcategories: [
				{
					id: 'restricted-products',
					title: 'What is being sold or advertised?',
					tags: ['Drugs', 'Alcohol', 'Weapons'],
					subcategories: [
						{
							id: 'drug-types',
							title: 'What kind of drugs are we talking about?',
							tags: ['Addictive', 'Light drugs'],
							subcategories: [
								{
									id: 'specific-drugs',
									title: 'What kind of drugs are addictive?',
									tags: ['Opioids', 'Stimulants', 'Hallucinogens'],
								},
							],
						},
					],
				},
			],
		},
		{
			id: 'offense',
			title: 'Сhoose a problem',
			tags: ['Bullying', 'Harassment', 'Hate speech'],
			subcategories: [
				{
					id: 'hate-speech',
					title: 'Who is the hate speech directed at?',
					tags: ['Race', 'Religion', 'Gender'],
				},
			],
		},
		{
			id: 'misinformation',
			title: 'Сhoose a problem',
			tags: ['Health', 'Politics', 'Finance'],
			subcategories: [
				{
					id: 'health',
					title: 'What kind of health misinformation?',
					tags: ['Against vaccination', 'Miracle cures'],
				},
			],
		},
	];

	// Хук состояния для отслеживания текущего пути (вложенности)
	const [currentPath, setCurrentPath] = useState([]); // Например: ['ads', 'restricted-products']

	// Хук состояния для хранения текста, введённого пользователем на последнем шаге
	const [reportText, setReportText] = useState('');

	// Функция для получения текущего уровня данных из структуры
	const getCurrentCategory = () => {
		// Начинаем с полной структуры
		let category = reportFlow;

		// Прогружаем вложенности в соответствии с currentPath
		for (const id of currentPath) {
			category = category.find((item) => item.id === id)?.subcategories;
		}

		// Если достигли последнего уровня или путь пустой, возвращаем текущую категорию
		return category || reportFlow;
	};

	// Обработчик клика по тегу
	const handleTagClick = (tagId) => {
		// Находим категорию по id
		const category = getCurrentCategory().find((item) => item.id === tagId);

		// Если у категории есть вложенные подкатегории, добавляем её id в currentPath
		if (category?.subcategories) {
			setCurrentPath([...currentPath, tagId]);
		} else {
			// Если это последний уровень, подготавливаем поле для текста
			setReportText('');
		}
	};

	// Обработчик для кнопки "Назад"
	const handleBackClick = () => {
		// Удаляем последний элемент пути (возвращаемся на уровень выше)
		setCurrentPath(currentPath.slice(0, -1));
	};

	// Обработчик отправки репорта. Можно сильно не вникать, чисто опциональная вещь
	const handleSubmit = () => {
		console.log('Отправленный репорт:', {
			path: currentPath,
			text: reportText,
		});

		setCurrentPath([]);
		setReportText('');
		dispatch(setPopupText('Your report has been successfully sent'));
		setPopupSource('success');
	};

	// Текущий уровень вложенности, вычисленный из currentPath
	const currentCategory = getCurrentCategory();

	return (
		<form action='' className='report-popup'>
			{/* Кнопка "Назад", отображается только если мы не на первом уровне */}
			{currentPath.length > 0 && (
				<button type='button' className='report-popup__back' onClick={handleBackClick}>
					<ArrowLeftIcon /> Back
				</button>
			)}

			{/* Заголовок репорта */}
			<h2 className='title lh--140 mb--16 report-popup__title'>
				{currentCategory[0]?.title || 'Сhoose a problem'}
			</h2>

			{/* Разделительная линия */}
			<hr className='mb--16' />

			{/* Список вариантов жалобы */}
			<ul className='report-popup__list'>
				{currentCategory.some((item) => item.subcategories) ? (
					<li>
						{/* Если есть подкатегории, отображаем кнопки для тегов */}
						{currentCategory.map((item) => (
							<button
								key={item.id}
								className='report-popup__item lh--140'
								onClick={() => handleTagClick(item.id)} // Клик по тегу
							>
								{item.tags.join(', ')} {/* Отображаем теги для текущей категории */}
							</button>
						))}
					</li>
				) : (
					<div className='report-popup__textarea-wrapper'>
						{/* Если вложенность закончилась, отображаем поле для текста */}
						<textarea
							className='mb--16 report-popup__textarea'
							placeholder='. . .'
							value={reportText}
							onChange={(e) => setReportText(e.target.value)}
						/>
						{/* Кнопка для отправки репорта */}
						<button
							className='button'
							onClick={() => {
								handleSubmit();
							}}
						>
							Send report
						</button>
					</div>
				)}
			</ul>
		</form>
	);
};

export default ReportPopup;
