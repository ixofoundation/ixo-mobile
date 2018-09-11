require('node-libs-react-native/globals');
// @ts-ignore
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Font, ScreenOrientation } from 'expo';
import { Root, StyleProvider, Text } from 'native-base';
import * as React from 'react';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react'
import { I18nextProvider, translate } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from './i18n';
// @ts-ignore
import getTheme from './native-base-theme/components';
// @ts-ignore
import Ionicons from './node_modules/@expo/vector-icons/fonts/Ionicons.ttf';
import OnBoardingNavigator from './Routes';
import './shim.js';
import { createPublicSiteStore } from './src/redux/store';
import Loading from './src/screens/Loading';

const Roboto_medium = require('./assets/fonts/Roboto/Roboto-Regular.ttf');
const Roboto_condensed = require('./assets/fonts/Roboto/RobotoCondensed-Regular.ttf');

interface State {
	isReady: boolean;
}

const store = createPublicSiteStore();

const TranslateStack = () => {
	return <OnBoardingNavigator screenProps={{ t: i18n.getFixedT('') }} />;
};

const ReloadAppOnLanguageChange = translate('translation', {
	bindI18n: 'languageChanged',
	bindStore: 'false'
})(TranslateStack);

export default class App extends React.Component<{}, State> {
	state = {
		isReady: false
	};

	async componentDidMount() {
		ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
		await Font.loadAsync({
			Ionicons,
			Roboto_medium,
			Roboto_condensed
		});
		this.setState({ isReady: true });
	}

	render() {
		if (this.state.isReady) {
			return (
				<Root>
					<StyleProvider style={getTheme()}>
						<ActionSheetProvider>
							<Provider store={store.store}>
								<PersistGate loading={<Loading />} persistor={store.persistor}>
									<I18nextProvider i18n={i18n}>
										<ReloadAppOnLanguageChange />
									</I18nextProvider>
								</PersistGate>
							</Provider>
						</ActionSheetProvider>
					</StyleProvider>
				</Root>
			);
		}
		return <Loading />;
	}
}
