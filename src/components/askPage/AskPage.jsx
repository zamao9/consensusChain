import { useState } from 'react';
import './askPage.sass';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectUserId } from '../../feature/profile/profileSelector';

const AskPage = ({
	setPopup,
	setPopupText,
	setPopupSource,
}) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);

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
	const [questionText, setQuestionText] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleTagClick = (key) => {
		setFiltersItems((prevItems) => {
			const activeCount = prevItems.filter((item) => item.active).length;
			return prevItems.map((item) => {
				if (item.key === key) {
					if (!item.active && activeCount >= 3) return item;
					return { ...item, active: !item.active };
				}
				return item;
			});
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		setIsSubmitting(true);

		// Формируем массив выбранных тегов
		const selectedTags = filtersItems
			.filter((item) => item.active)
			.map((item) => item.label);

		// Создаем payload для отправки на сервер
		const payload = {
			user_id: userId.toString(),
			title: questionText, // Изменено поле на title для соответствия API
			is_private: currPrivacyBtn,
			tags: selectedTags,
		};

		try {
			const response = await fetch('http://localhost:8000/questions/', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			//console.log(response)
			// Проверяем успешность ответа
			if (response.ok) {
				setPopup(true);
				setPopupText(
					'Your question has been successfully submitted. The review process may take up to 24 hours. Once the review is complete, you will receive a notification about the status of your question.'
				);
				setPopupSource('success');

				// Сброс полей формы
				setQuestionText('');
				setFiltersItems(initialItems);
				setPrivacyBtn(false);
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Не удалось отправить вопрос.');
			}
		} catch (error) {
			// Обработка ошибок
			setPopup(true);
			setPopupText('Произошла ошибка при отправке вопроса. Попробуйте ещё раз.');
			setPopupSource('error');
			console.error('Ошибка при отправке вопроса:', error);
		} finally {
			// Снимаем флаг отправки
			setIsSubmitting(false);
		}
	};


	return (
		<form onSubmit={handleSubmit} className='ask-page'>
			<h2 className='title mb--22 ask-page__title'>Ask your question</h2>
			<textarea
				placeholder='. . .'
				className='text mb--22 lh--140 ask-page__textarea'
				required
				value={questionText}
				onChange={(e) => setQuestionText(e.target.value)}
			/>

			<h2 className='title mb--22 ask-page__title'>Filters</h2>
			<div className='filters'>
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
					{filtersItems.at(-1).active === true && (
						<div className='mt--8 filters__button filters__other'>
							<input type='text' required placeholder='Tag' />
						</div>
					)}
				</ul>
				<hr />
				<div className='ask-page__privacy-buttons'>
					<button
						type='button'
						className={`ask-page__privacy-button ask-page__public-button ${!currPrivacyBtn ? 'active' : ''}`}
						onClick={() => setPrivacyBtn(false)}
					>
						Public
					</button>
					<button
						type='button'
						className={`ask-page__privacy-button ask-page__private-button ${currPrivacyBtn ? 'active' : ''}`}
						onClick={() => setPrivacyBtn(true)}
					>
						Private
					</button>
				</div>
				{currPrivacyBtn === true && (
					<div className='filters__button filters__private'>
						<input type='text' required placeholder='@nickname' />
					</div>
				)}
			</div>

			<div className='mt--32 ask-page__button-wrapper'>
				<button className='button ask-page__button' type='submit' disabled={isSubmitting}>
					Submit
				</button>
			</div>

		</form>
	);
};

export default AskPage;
