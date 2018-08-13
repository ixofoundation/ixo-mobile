require('node-libs-react-native/globals');
import * as React from 'react';
import { StyleProvider, Root } from 'native-base';
import { Provider } from 'react-redux';
import { Font, ScreenOrientation } from 'expo';

import getTheme from './native-base-theme/components';
import Loading from './src/screens/Loading';
import Stack from './Routes';

import Ionicons from './node_modules/@expo/vector-icons/fonts/Ionicons.ttf';
import { AsyncStorage } from './node_modules/@types/react-native';
import { createPublicSiteStore } from './src/redux/store';
const Roboto_medium = require('./assets/fonts/Roboto/Roboto-Medium.ttf');
interface State {
	isReady: boolean;
}

const store = createPublicSiteStore();
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
						<Provider store={store}>
							<Stack />
						</Provider>
					</StyleProvider>
				</Root>
			);
		}
		return <Loading />;
	}
}
