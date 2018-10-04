require('node-libs-react-native/globals');
import * as React from 'react';
import SplashScreen from 'react-native-splash-screen';
import './shim.js';
// @ts-ignore
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
// @ts-ignore
import { Root, StyleProvider } from 'native-base';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { createAppStore } from './src/redux/store';
import Translator from './src/Translator';
import Loading from './src/screens/Loading';
// @ts-ignore
import getTheme from './src/native-base-theme/components/index.js';
// @ts-ignore
import { Platform } from 'react-native';
// YellowBox.ignoreWarnings(['Class RCTCxxModule']);

interface State {
	isReady: boolean;
}

const store = createAppStore();

export default class App extends React.Component<{}, State> {
	componentDidMount() {
		if (Platform.OS === 'android') {
			SplashScreen.hide();
		}
	}

	render() {
		return (
			<Root>
				<StyleProvider style={getTheme()}>
					<ActionSheetProvider>
						<Provider store={store.store}>
							<PersistGate loading={<Loading />} persistor={store.persistor}>
								<Translator />
							</PersistGate>
						</Provider>
					</ActionSheetProvider>
				</StyleProvider>
			</Root>
		);
	}
}
