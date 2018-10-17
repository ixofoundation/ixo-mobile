import { Text } from 'native-base';
import * as React from 'react';
import Video from 'react-native-video';
import { Dimensions, Image, ImageBackground, StatusBar, View, TouchableOpacity } from 'react-native';
import DarkButton from '../components/DarkButton';
import LightButton from '../components/LightButton';
import { ThemeColors } from '../styles/Colors';
import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';

const logo = require('../../assets/logo.png');
const background = require('../../assets/background_1.png');
const keysafelogo = require('../../assets/keysafe-logo.png');
const qr = require('../../assets/qr.png');
const globe = require('../../assets/globe.mp4');

const { height, width } = Dimensions.get('window');

// const LogoView = () => (
// 	<View style={ContainerStyles.flexColumn}>
// 		<View style={ContainerStyles.flexRow}>
// 			<Image resizeMode={'contain'} style={ConnectIXOStyles.logo} source={logo} />
// 		</View>
// 	</View>
// );

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
		return (
			<View style={ConnectIXOStyles.loginWrapper}>
				<StatusBar barStyle='light-content' />
				<Video
					source={globe}
					rate={1.0}
					volume={1.0}
					muted={false}
					resizeMode={'cover'}
					repeat
					style={ConnectIXOStyles.globeView}
				/>
				<View style={[ContainerStyles.flexColumn, { justifyContent: 'space-between' }]}>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'row'
						}}
					>
						<Image resizeMode={'contain'} style={ConnectIXOStyles.logo} source={logo} />
					</View>
					<View style={{ width: '100%' }}>
						<LightButton propStyles={{ marginBottom: 10 }} text={this.props.screenProps.t('connectIXO:registerButton')} onPress={() => this.props.navigation.navigate('Register')} />
						<DarkButton
							text={this.props.screenProps.t('connectIXO:scanButton')}
							onPress={() => this.props.navigation.navigate('ScanQR')}
						/>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Recover')}>
							<Text style={ConnectIXOStyles.recover}>{this.props.screenProps.t('connectIXO:recover')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}
