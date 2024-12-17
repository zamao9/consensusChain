import { useState } from 'react';
import './questionPage.sass';

const QuestionPage = () => {
	const filtersItems = [
		{
			key: 1,
			label: 'Technology',
		},
		{
			key: 2,
			label: 'Science',
		},
		{
			key: 3,
			label: 'Education',
		},
		{
			key: 4,
			label: 'Entertainment',
		},
		{
			key: 5,
			label: 'Business',
		},
		{
			key: 6,
			label: 'Philosophy',
		},
		{
			key: 7,
			label: 'Lifestyle',
		},
		{
			key: 8,
			label: 'Travel',
		},
		{
			key: 9,
			label: 'History',
		},
		{
			key: 10,
			label: 'Other',
		},
	];
	return (
		<form className='question-page'>
			<textarea
				placeholder='Лень делать заебался, завтра сделаю'
				className='text question-page__input'
			/>
			<div className='question-page__button-wrapper'>
				<button className='button question-page__button' type='button'>
					Submit
				</button>
			</div>

			<h2 className='title'>Filters</h2>
			<ul className='filters'>
				{filtersItems.map((element) => (
					<li className='filters__item' key={element.key}>
						{element.label}
					</li>
				))}
			</ul>
		</form>
	);
};

export default QuestionPage;
