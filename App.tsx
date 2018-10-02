require('node-libs-react-native/globals');
import * as React from 'react';
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
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

interface State {
	isReady: boolean;
}

const store = createAppStore();

export default class App extends React.Component<{}, State> {
	state = {
		isReady: false
	};

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
