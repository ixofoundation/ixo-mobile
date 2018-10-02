import * as React from 'react';
import { NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { I18nextProvider, translate } from 'react-i18next';
import OnBoardingNavigator from './Routes';
import { PublicSiteStoreState } from './redux/public_site_reducer';
import { toggleConnection } from './redux/connectivity/connectivity_action_creators';
import i18n from './i18n';

export interface DispatchProps {
	onToggleConnection: (offlineState: boolean) => void;
}

interface Props extends DispatchProps {}

class TranslateStack extends React.Component<Props, {}> {
	componentDidMount() {
		// NetInfo.isConnected.fetch().then(isConnected => {
		// 	console.log('CONNECTED:::', isConnected);
		// 	this.props.onToggleConnection(isConnected);
		// });
		// NetInfo.isConnected.addEventListener('connectionChange', isConnected => this.props.onToggleConnection(isConnected));
	}

	render() {
		return <OnBoardingNavigator screenProps={{ t: i18n.getFixedT('') }} />;
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		// connectivity: state.connectivityStore.offline
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onToggleConnection: (offlineState: boolean) => {
			dispatch(toggleConnection(offlineState));
		}
	};
}

const ReloadAppOnLanguageChange = translate('translation', {
	bindI18n: 'languageChanged',
	bindStore: 'false'
})(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TranslateStack)
);

export default class Translator extends React.Component<{}, {}> {
	render() {
		return (
			// @ts-ignore
			<I18nextProvider i18n={i18n}>
				<ReloadAppOnLanguageChange />
			</I18nextProvider>
		);
	}
}