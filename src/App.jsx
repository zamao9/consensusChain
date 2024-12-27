import './App.sass';
import AppScreen from './components/appScreen/AppScreen';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
	return <Provider store={store}>
		<AppScreen />
	</Provider>;
}

export default App;
