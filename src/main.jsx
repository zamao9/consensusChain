import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './reset.scss';
import './normalize.scss';
import './fonts.scss';
import './index.sass';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>
);
