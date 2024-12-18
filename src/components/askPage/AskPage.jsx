import { useState } from 'react';
import './askPage.sass';

const AskPage = () => {
	//Массив с тегами для фильтров
	const filtersItems = [
		{
			key: 1,
			label: 'Business',
		},
		{
			key: 2,
			label: 'Education',
		},
		{
			key: 3,
			label: 'Entertainment',
		},
		{
			key: 4,
			label: 'Health',
		},
		{
			key: 5,
			label: 'History',
		},
		{
			key: 6,
			label: 'Lifestyle',
		},
		{
			key: 7,
			label: 'Philosophy',
		},
		{
			key: 8,
			label: 'Science',
		},
		{
			key: 9,
			label: 'Technology',
		},
		{
			key: 10,
			label: 'Travel',
		},
		{
			key: 11,
			label: 'Other',
		},
	];

	return (
		<form action='' className='ask-page'>
			<h2 className='title mb--10 ask-page__title'>Ask your question</h2>
			{/* Текстовое поле для ввода вопроса */}
			<textarea placeholder='Your question' className='text ask-page__input' required />

			<h2 className='title mb--10 ask-page__title'>Filters</h2>
			{/* Обертка для фильтров */}
			<div className='filters'>
				{/* Теги */}
				<ul className='filters__list'>
					{filtersItems.map((element) => (
						<li className='button filters__item' key={element.key}>
							{element.label}
						</li>
					))}

					{/* Поле для ввода своего тега */}
					<div className='mt--16 filters__button filters__other'>
						<input type='text' required placeholder='Tag' />
					</div>
				</ul>

				{/* Разделительная линия */}
				<hr />

				{/* Публичная и приватная кнопки */}
				<div className='ask-page__privacy-buttons'>
					<button
						type='button'
						className='button ask-page__privacy-button ask-page__public-button active'
					>
						Public
					</button>
					<button
						type='button'
						className='button ask-page__privacy-button ask-page__private-button'
					>
						Private
					</button>
				</div>

				{/* Поле для ввода никнейма для приватного вопроса */}
				<div className='filters__button filters__private'>
					<input type='text' required placeholder='@nickname' />
				</div>
			</div>
			{/* Кнопка для отправки вопроса */}
			<div className='mt--32 ask-page__button-wrapper'>
				<button className='button ask-page__button' disabled type='submit'>
					Submit
				</button>
			</div>
		</form>
	);
};

export default AskPage;
