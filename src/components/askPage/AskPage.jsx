import { useState } from 'react';
import './askPage.sass';

const AskPage = () => {
	//Массив с тегами для фильтров
	const initialItems = [
		{ key: 1, label: 'Business', active: false },
		{ key: 2, label: 'Education', active: false },
		{ key: 3, label: 'Entertainment', active: false },
		{ key: 4, label: 'Health', active: false },
		{ key: 5, label: 'History', active: false },
		{ key: 6, label: 'Lifestyle', active: false },
		{ key: 7, label: 'Philosophy', active: false },
		{ key: 8, label: 'Science', active: false },
		{ key: 9, label: 'Technology', active: false },
		{ key: 10, label: 'Travel', active: false },
		{ key: 11, label: 'Other', active: false },
	];

	const [filtersItems, setFiltersItems] = useState(initialItems);
	const [currPrivacyBtn, setPrivacyBtn] = useState(false);
	const [currSubmitBtn, setSubmitBtn] = useState(false);

	// Функция для обработки выбора тегов
	const handleTagClick = (key) => {
		setFiltersItems((prevItems) => {
			const activeCount = prevItems.filter((item) => item.active).length;
			return prevItems.map((item) => {
				if (item.key === key) {
					// Разрешаем выбор только если тег не активен и активных тегов меньше 5
					if (!item.active && activeCount >= 3) return item;
					return { ...item, active: !item.active };
				}
				return item;
			});
		});
	};

	return (
		<form action='' className='ask-page'>
			<h2 className='title mb--10 ask-page__title'>Ask your question</h2>
			{/* Текстовое поле для ввода вопроса */}
			<textarea
				placeholder='Your question'
				className='text mb--22 lh--140 ask-page__textarea '
				required
			/>

			<h2 className='title mb--10 ask-page__title'>Filters</h2>
			{/* Обертка для фильтров */}
			<div className='filters'>
				{/* Теги */}
				<ul className='filters__list'>
					{filtersItems.map((element) => (
						<li key={element.key}>
							<button
								type='button'
								className={`filters__item ${element.active ? 'active' : ''}`}
								onClick={() => handleTagClick(element.key)}
							>
								{element.label}
							</button>
						</li>
					))}

					{/* Если Other активен, то поле для ввода тега показано */}
					{filtersItems.at(-1).active === true && (
						<div className='mt--8 filters__button filters__other'>
							<input type='text' required placeholder='Tag' />
						</div>
					)}
				</ul>

				{/* Разделительная линия */}
				<hr />

				{/* Публичная и приватная кнопки */}
				<div className='ask-page__privacy-buttons'>
					<button
						type='button'
						className={`ask-page__privacy-button ask-page__public-button ${
							currPrivacyBtn === false ? 'active' : ''
						}`}
						onClick={() => setPrivacyBtn(false)}
					>
						Public
					</button>
					<button
						type='button'
						className={`ask-page__privacy-button ask-page__private-button ${
							currPrivacyBtn === true ? 'active' : ''
						}`}
						onClick={() => setPrivacyBtn(true)}
					>
						Private
					</button>
				</div>

				{/* Поле для ввода никнейма для приватного вопроса */}
				{currPrivacyBtn === true && (
					<div className='filters__button filters__private'>
						<input type='text' required placeholder='@nickname' />
					</div>
				)}
			</div>

			{/* Кнопка для отправки вопроса */}
			<div className='mt--32 ask-page__button-wrapper'>
				<button
					className={`button ask-page__button ${currSubmitBtn === false ? 'disabled' : ''}`}
					type='submit'
				>
					Submit
				</button>
			</div>
		</form>
	);
};

export default AskPage;
