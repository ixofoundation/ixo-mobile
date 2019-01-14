require('node-libs-react-native/globals');
import * as React from 'react';
import SplashScreen from 'react-native-splash-screen';
import './shim.js';
// @ts-ignore
import { Root, StyleProvider } from 'native-base';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { createAppStore } from './src/redux/store';
import Translator from './src/Translator';
import Loading from './src/screens/Loading';
import getTheme from './native-base-theme/components/index';
// @ts-ignore
import { Platform } from 'react-native';
// import Sockets from './src/utils/sockets';
// YellowBox.ignoreWarnings(['Class RCTCxxModule']);

interface State {
	isReady: boolean;
}

const store = createAppStore();

export default class App extends React.Component<{}, State> {
	// private sockets: Sockets = new Sockets();
	componentDidMount() {
		if (Platform.OS === 'android') {
			SplashScreen.hide();
		}
	}

	render() {
		return (
			<Root>
				<StyleProvider style={getTheme()}>
						<Provider store={store.store}>
							<PersistGate loading={<Loading />} persistor={store.persistor}>
								<Translator />
							</PersistGate>
						</Provider>
				</StyleProvider>
			</Root>
		);
	}
}
