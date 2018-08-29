import * as React from 'react';
import { View, StatusBar, Image, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Text } from 'native-base';

import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';
import DarkButton from '../components/DarkButton';
import LightButton from '../components/LightButton';

const logo = require('../../assets/logo.png');
const background = require('../../assets/backgrounds/background_1.png');
const keysafelogo = require('../../assets/keysafe-logo.png');
const qr = require('../../assets/qr.png');

const { height, width } = Dimensions.get('window');

const LogoView = () => (
	<View style={ContainerStyles.flexColumn}>
		<View style={ContainerStyles.flexRow}>
			<Image resizeMode={'contain'} style={ConnectIXOStyles.logo} source={logo} />
		</View>
	</View>
);

const InfoBlocks = ({ keySafeText, qrCodeText }: { keySafeText: string; qrCodeText: string }) => (
	<View style={[ContainerStyles.flexRow, { alignItems: 'flex-end', marginBottom: height * 0.04 }]}>
		<View style={[ContainerStyles.flexRow, ConnectIXOStyles.infoBlock]}>
			<Image resizeMode={'contain'} style={ConnectIXOStyles.infoBlockImage} source={keysafelogo} />
			<Text style={{ color: ThemeColors.white, fontSize: 12, padding: 10, width: width * 0.35 }}>{keySafeText}</Text>
		</View>
		<View style={[ContainerStyles.flexRow, ConnectIXOStyles.infoBlock, { borderLeftWidth: 0 }]}>
			<Image resizeMode={'contain'} style={ConnectIXOStyles.infoBlockImage} source={qr} />
			<Text style={{ color: ThemeColors.white, fontSize: 12, padding: 10, width: width * 0.35 }}>{qrCodeText}</Text>
		</View>
	</View>
);

interface ParentProps {
	navigation: any;
	screenProps: any;
}

export default class ConnectIXO extends React.Component<ParentProps, {}> {
	render() {
		const registerAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Register' })]
		});
		return (
			<ImageBackground source={background} style={[ConnectIXOStyles.wrapper, { width: '100%', height: '100%', paddingHorizontal: 10 }]}>
				<StatusBar barStyle="light-content" />
				<View style={[ContainerStyles.flexColumn, { justifyContent: 'space-between' }]}>
					<LogoView />
					<InfoBlocks qrCodeText={this.props.screenProps.t('connectIXO:qrCodeInfo')} keySafeText={this.props.screenProps.t('connectIXO:keySafeInfo')} />
					<DarkButton
						text={this.props.screenProps.t('connectIXO:scanButton')}
						onPress={() => this.props.navigation.navigate('ScanQR')}
						propStyles={{ marginBottom: 10 }}
					/>

					<LightButton
						text={this.props.screenProps.t('connectIXO:registerButton')}
						onPress={() => this.props.navigation.navigate('Register')}
						propStyles={{ marginBottom: height * 0.1 }}
					/>
				</View>
			</ImageBackground>
		);
	}
}
