import './askPage.sass';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { selectDailyTasksStatus, selectUserId } from '../../feature/profile/profileSelector';
import { NotificationIcon, SearchInputIcon } from '../../constants/SvgIcons';
import { setDailyTaskCheck } from '../../feature/profile/profileSlice';

const AskPage = ({ setPage, setTab, setItem, setPopup, setPopupText, setPopupSource }) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector(selectUserId);

	// Initialising the tag list
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
		{ key: 11, label: 'Other', active: false }, // Tag "Other"
	];

	// Initialising the languages list
	const initialLanguage = [
		{
			id: 1,
			label: 'English',
			status: true,
		},
		{
			id: 2,
			label: 'French',
			status: false,
		},
		{
			id: 3,
			label: 'Russian',
			status: false,
		},
	];

	const [languageFilter, setLanguageFilter] = useState(initialLanguage);

	// States
	const [filtersItems, setFiltersItems] = useState(initialItems);
	const [currPrivacyBtn, setPrivacyBtn] = useState(false);
	const [questionText, setQuestionText] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [otherTag, setOtherTag] = useState(''); // New tag "Other"

	// Tag click handler
	const handleTagClick = (key) => {
		setFiltersItems((prevItems) => {
			const activeCount = prevItems.filter((item) => item.active).length;
			return prevItems.map((item) => {
				if (item.key === key) {
					// Check if the tag can be activated
					if (!item.active && activeCount >= 3) return item;
					return { ...item, active: !item.active };
				}
				return item;
			});
		});
	};

	// Languages click handler
	const handleLanguageChange = (id) => {
		const updatedLanguages = languageFilter.map((lang) =>
			lang.id === id ? { ...lang, status: true } : { ...lang, status: false }
		);
		setLanguageFilter(updatedLanguages);
	};

	// Form submission handler
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if at least one tag is selected
		const selectedTags = filtersItems
			.filter((item) => item.active)
			.map((item) => (item.label === 'Other' ? otherTag : item.label))
			.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)); // Convert the first letter to upper case

		if (selectedTags.length === 0 || (selectedTags.includes('') && filtersItems[10].active)) {
			setPopup(true);
			setPopupText('Please select at least one tag.');
			setPopupSource('error');
			return;
		}

		if (isSubmitting) return;
		setIsSubmitting(true);

		// Find the selected language
		const selectedLanguage = languageFilter.find((lang) => lang.status)?.label || ''; // Default to empty string if no language is selected

		// Create a payload to send to the server
		const payload = {
			user_id: userId.toString(),
			title: questionText, // Changed field to title for API compliance
			is_private: currPrivacyBtn,
			tags: selectedTags,
			language: selectedLanguage, // Add the selected language here
		};

		try {
			const response = await fetch('https://web-production-c0b1.up.railway.app/questions/', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Checking the success of the answer
			if (response.ok) {
				setPopup(true);
				setPopupText(
					'Your question has been successfully submitted. The review process may take up to 24 hours. Once the review is complete, you will receive a notification about the status of your question.'
				);
				setPopupSource('success');

				// Resetting form fields
				setQuestionText('');
				setFiltersItems(initialItems);
				setPrivacyBtn(false);
				setOtherTag(''); // Clearing the field "Other"
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to submit the question.');
			}
		} catch (error) {
			// Error handling
			setPopup(true);
			setPopupText('An error occurred while submitting the question. Please try again.');
			setPopupSource('error');
			console.error('Error submitting the question:', error);
		} finally {
			// Clear the send flag
			setIsSubmitting(false);
		}
	};

	// const dailyTaskCheck = useAppSelector(selectDailyTasksStatus);
	const dailyTaskCheck = useAppSelector(selectDailyTasksStatus);

	return (
		<>
			{/* Links wrapper */}
			{!dailyTaskCheck && (
				<ul className='ask-page__links-wrapper mb--16'>
					{/* Wrapper for buttons, links, tabs etc. */}
					<li className='button-wrapper'>
						{/* Link */}
						<button
							className='link'
							onClick={() => {
								// showDailyTasks();
								setDailyTaskCheck(true);
								setPage('tasks-page');
								setTab('second');
								setItem('tasks-page');
							}}
						>
							<NotificationIcon />
						</button>
					</li>
				</ul>
			)}

			<form onSubmit={handleSubmit} className='ask-page'>
				{/* Title */}
				{/* <h2 className='title mb--22'>Ask your question</h2> */}

				{/* Textarea */}
				<textarea
					placeholder='Ask your question'
					className='text mb--22 ask-page__textarea'
					required
					value={questionText}
					onChange={(e) => setQuestionText(e.target.value)}
				/>

				{/* Title */}
				{/* <h2 className='title mb--22'>Filters</h2> */}

				{/* Wrapper for Filters */}
				<div className='filters'>
					{/* Filters list */}
					<ul className='filters-list'>
						{/* Filters Item */}
						{filtersItems.map((element) => (
							<li key={element.key}>
								<button
									type='button'
									className={`button filters-list__button ${element.active ? 'active' : ''}`}
									onClick={() => handleTagClick(element.key)}
								>
									{element.label}
								</button>
							</li>
						))}

						{/* Show the text field if the tag is selected "Other" */}
						{filtersItems[10].active && (
							// Tag entry field
							<div className='input mt--8 filters__other'>
								{' '}
								<input
									type='text'
									required
									placeholder='Enter custom tag'
									value={otherTag}
									onChange={(e) => setOtherTag(e.target.value)}
								/>
							</div>
						)}
					</ul>

					{/* Dividing line */}
					<hr />

					{/* Languages filter list */}
					<ul className='filters-list'>
						{/* Languages filter items */}
						{languageFilter.map((element) => (
							<li key={element.id}>
								<button
									type='button'
									className={`button filters-list__button ${element.status ? 'active' : ''}`}
									onClick={() => handleLanguageChange(element.id)}
								>
									{element.label}
								</button>
							</li>
						))}
					</ul>

					{/* Dividing line */}
					<hr />

					{/* Privacy buttons */}
					<ul className='filters-list'>
						{/* Public questions button */}
						<li>
							<button
								type='button'
								className={`button filters-list__button ask-page__public-button ${
									!currPrivacyBtn ? 'active' : ''
								}`}
								onClick={() => setPrivacyBtn(false)}
							>
								Public
							</button>
						</li>

						{/* Private questions button */}
						{/* <li>
							<button
								type='button'
								className={`button filters-list__button ask-page__private-button ${
									currPrivacyBtn ? 'active' : ''
								}`}
								onClick={() => setPrivacyBtn(true)}
							>
								Private
							</button>
						</li> */}
					</ul>

					{/* Nickname entry field */}
					{/* {currPrivacyBtn && (
						<div
							className={`input input-relative filters__private ${
								currPrivacyBtn ? 'active' : false
							}`}
						>
							<input type='text' required placeholder='@nickname' />
							<SearchInputIcon />
						</div>
					)} */}
				</div>

				{/* Wrapper for send aquestion button */}
				<div className='mt--32 button-wrapper submit-button-wrapper'>
					{/* Submit button */}
					<button className='submit-button ask-page__button' type='submit' disabled={isSubmitting}>
						Submit
					</button>
				</div>
			</form>
		</>
	);
};

export default AskPage;
