require('node-libs-react-native/globals');
import * as React from 'react';
import { StyleProvider, Root } from 'native-base';
import { Provider } from 'react-redux';
import { I18nextProvider, translate } from 'react-i18next';
import { Font, ScreenOrientation, Util } from 'expo';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// @ts-ignore
import getTheme from './native-base-theme/components';
import Loading from './src/screens/Loading';
import Stack from './Routes';
import i18n from './i18n';
// @ts-ignore
import Ionicons from './node_modules/@expo/vector-icons/fonts/Ionicons.ttf';
import { AsyncStorage } from './node_modules/@types/react-native';
import { createPublicSiteStore } from './src/redux/store';
const Roboto_medium = require('./assets/fonts/Roboto/Roboto-Medium.ttf');

interface State {
	isReady: boolean;
}

const store = createPublicSiteStore();

const TranslateStack = () => {
	return <Stack screenProps={{ t: i18n.getFixedT('') }} />;
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
			Roboto_medium
		});
		this.setState({ isReady: true });
	}

	render() {
		if (this.state.isReady) {
			return (
				<Root>
					<StyleProvider style={getTheme()}>
						<ActionSheetProvider>
							<Provider store={store}>
								<I18nextProvider i18n={ i18n }>
									<ReloadAppOnLanguageChange />
								</I18nextProvider>
							</Provider>
						</ActionSheetProvider>
					</StyleProvider>
				</Root>
			);
		}
		return <Loading />;
	}
}
