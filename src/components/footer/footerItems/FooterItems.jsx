const FooterItems = ({ curItem, setItem, label, svg }) => {
	return (
		<li
			className={`footer__items ${curItem === label ? 'active' : ''}`}
			onClick={() => setItem(label)}
		>
			{svg}
		</li>
	);
};

export default FooterItems;
