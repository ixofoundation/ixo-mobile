import { Text } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import * as React from 'react';
import Video from 'react-native-video';
import { Image, StatusBar, View, TouchableOpacity, Platform } from 'react-native';
import DarkButton from '../components/DarkButton';
import LightButton from '../components/LightButton';
import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';

const logo = require('../../assets/logo.png');
const globe = require('../../assets/globe.mp4');

interface ParentProps {
	navigation: any;
	screenProps: any;
}

export default class ConnectIXO extends React.Component<ParentProps, {}> {
	handleOnScanNavigate() {
		const resetAction = StackActions.reset({
			index: 1,
			actions: [NavigationActions.navigate({ routeName: 'ConnectIXO' }), NavigationActions.navigate({ routeName: 'ScanQR', params: { projectScan: false }})]
		});
		this.props.navigation.dispatch(resetAction);
	}

	render() {
		return (
			<View style={ConnectIXOStyles.loginWrapper}>
				<StatusBar barStyle="light-content" />
				<Video source={globe} rate={1.0} volume={1.0} muted={false} resizeMode={'cover'} repeat style={ConnectIXOStyles.globeView} />
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
						<LightButton
							propStyles={{ marginBottom: 10 }}
							text={this.props.screenProps.t('connectIXO:registerButton')}
							onPress={() => this.props.navigation.navigate('Register')}
						/>
						{Platform.OS === 'android' ? <DarkButton text={this.props.screenProps.t('connectIXO:scanButton')} onPress={() => this.handleOnScanNavigate()} /> : null}
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Recover')}>
							<Text style={ConnectIXOStyles.recover}>{this.props.screenProps.t('connectIXO:recover')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}
