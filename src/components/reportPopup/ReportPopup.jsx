import { useState } from 'react';
import './reportPopup.sass';
import { ArrowLeftIcon } from '../../constants/SvgIcons';
import { form } from 'framer-motion/client';

const ReportPopup = () => {
	const reportData = [
		{
			key: 'ads',
			label: 'Restricted advertising',
			subcategories: [
				{
					key: 'product-type',
					label: 'Что рекламируется',
					options: [
						{ key: 'drugs', label: 'Наркотики' },
						{ key: 'alcohol', label: 'Алкоголь' },
						{ key: 'weapons', label: 'Оружие' },
					],
					subcategories: [
						{
							key: 'drug-types',
							label: 'Какие наркотики?',
							options: [
								{ key: 'addictive-drugs', label: 'Наркотики, вызывающие зависимость' },
								{ key: 'soft-drugs', label: 'Лёгкие наркотики' },
							],
							subcategories: [
								{
									key: 'addictive-drug-details',
									label: 'Какие именно наркотики вызывают зависимость?',
									options: [
										{ key: 'opiokeys', label: 'Опioиды' },
										{ key: 'stimulants', label: 'Стимуляторы' },
										{ key: 'hallucinogens', label: 'Галлюциногены' },
									],
								},
							],
						},
					],
				},
			],
		},
		{
			key: 'offensive-content',
			label: 'Offensive content',
			subcategories: [
				{
					key: 'type-of-offense',
					label: 'Какой тип оскорбления?',
					options: [
						{ key: 'harassment', label: 'Преследование' },
						{ key: 'hate-speech', label: 'Речь ненависти' },
						{ key: 'bullying', label: 'Буллинг' },
					],
					subcategories: [
						{
							key: 'hate-speech-target',
							label: 'Кого нацеливает речь ненависти?',
							options: [
								{ key: 'race', label: 'По расе' },
								{ key: 'religion', label: 'По религии' },
								{ key: 'gender', label: 'По гендеру' },
							],
						},
					],
				},
			],
		},
		{
			key: 'misinformation',
			label: 'Misinformation',
			subcategories: [
				{
					key: 'type-of-misinformation',
					label: 'Какой тип дезинформации?',
					options: [
						{ key: 'health', label: 'О здоровье' },
						{ key: 'political', label: 'Политическая' },
						{ key: 'financial', label: 'Финансовая' },
					],
					subcategories: [
						{
							key: 'health-misinformation',
							label: 'Какая дезинформация о здоровье?',
							options: [
								{ key: 'anti-vaccine', label: 'Против вакцинации' },
								{ key: 'miracle-cures', label: 'Чудо-лекарства' },
							],
							subcategories: [
								{
									key: 'miracle-cures-details',
									label: 'Какие именно чудо-лекарства?',
									options: [
										{ key: 'fake-pills', label: 'Поддельные таблетки' },
										{ key: 'herbal-remedies', label: 'Травяные средства' },
									],
								},
							],
						},
					],
				},
			],
		},
	];

	const [selectedPath, setSelectedPath] = useState([]);

	// Функция для обработки выбора категории
	const handleSelect = (levelIndex, selectedOption) => {
		// Обновляем путь до текущего уровня, заменяя выбранный элемент
		const newPath = selectedPath.slice(0, levelIndex);
		newPath.push(selectedOption);
		setSelectedPath(newPath);
	};

	// Получить текущие подкатегории
	const getCurrentSubcategories = () => {
		let currentLevel = reportData;
		for (const selected of selectedPath) {
			const foundCategory = currentLevel.find((item) => item.key === selected.key);
			if (foundCategory?.subcategories) {
				currentLevel = foundCategory.subcategories;
			} else {
				return null;
			}
		}
		return currentLevel;
	};

	const currentSubcategories = getCurrentSubcategories();

	return (
		<form action='' className='report-popup'>
			{/* Кнопка Back */}
			{/* <button type='button' className='report-popup__back'>
				<ArrowLeftIcon />
				Back
			</button> */}

			{/* Заголовок репорта */}
			<h2 className='title mb--16 report-popup__title'>Сhoose a problem</h2>

			{/* Разделительная линия */}
			<hr className='mb--16' />

			{/* Список вариантов жалобы */}
			<ul className='report-popup__list'>
				{currentSubcategories && (
					<>
						{currentSubcategories.map((element) => (
							<li key={element.key}>
								<button
									type='button'
									className='report-popup__item'
									onClick={() => handleSelect(selectedPath.length, element)}
								>
									{element.label}
								</button>
							</li>
						))}
					</>
				)}
			</ul>

			{/* Ввод комментария в textarea */}
			{/* <div className='report-popup__textarea-wrapper'>
				<textarea
					name=''
					id=''
					placeholder='Your comment'
					className='mb--22 report-popup__textarea'
				></textarea>
				<button className='button'>Sumbit</button>
			</div> */}
		</form>
	);
};

export default ReportPopup;
