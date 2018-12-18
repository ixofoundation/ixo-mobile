import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Container } from 'native-base';
import { Image, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';

import ContainerStyles from '../styles/Containers';
import SideBarStyles from '../styles/componentStyles/Sidebar';
import { ClaimsButton, SignOutBox } from '../styles/Colors';
import CustomIcon from '../components/svg/CustomIcons';
import { UserStorageKeys } from '../models/phoneStorage';
const ixoLogo = require('../../assets/logo.png');
const helpIcon = require('../../assets/help.png');
const settingIcon = require('../../assets/settings.png');
const { height } = Dimensions.get('window');

interface PropTypes {
	navigation: any;
	screenProps: any;
}

interface StateTypes {
	name: string;
	did: string;
}

class SideBar extends React.Component<PropTypes, StateTypes> {
	state = {
		name: '',
		did: ''
	}

	async retrieveUserFromStorage() {
		try {
			const name = await AsyncStorage.getItem(UserStorageKeys.name);
			const did = await AsyncStorage.getItem(UserStorageKeys.did);
			this.setState({ name, did });
		} catch (error) {
			console.error(error);
		}
	}

	componentDidMount() {
		this.retrieveUserFromStorage();
	}

	render() {
		return (
			<Container
				// @ts-ignore
				style={SideBarStyles.wrapper}
			>
				<LinearGradient style={SideBarStyles.userInfoBox} colors={[ClaimsButton.colorSecondary, ClaimsButton.colorPrimary]}>
					<View style={[ContainerStyles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
						<CustomIcon name="close" onPress={() => this.props.navigation.closeDrawer()} style={SideBarStyles.closeDrawer} />
						<Image source={ixoLogo} style={SideBarStyles.ixoLogo} />
					</View>
					<View style={[ContainerStyles.flexRow, SideBarStyles.userBox]}>
						<View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
							<Text style={SideBarStyles.userName}>{this.state.name}</Text>
							<Text style={SideBarStyles.userDid}>{this.state.did}</Text>
						</View>
					</View>
				</LinearGradient>
				<View style={[ContainerStyles.flexColumn, SideBarStyles.linksBox]}>
					{/* <TouchableOpacity style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
						<Image source={settingIcon} style={SideBarStyles.iconLinks} />
						<Text style={SideBarStyles.textLinks}>{this.props.screenProps.t('sidebar:settings')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
						<Image source={helpIcon} style={SideBarStyles.iconLinks} />
						<Text style={SideBarStyles.textLinks}>{this.props.screenProps.t('sidebar:help')}</Text>
					</TouchableOpacity> */}
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')} style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
						<Image source={settingIcon} style={SideBarStyles.iconLinks} />
						<Text style={SideBarStyles.textLinks}>{this.props.screenProps.t('sidebar:settings')}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Help')} style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
						<Image source={helpIcon} style={SideBarStyles.iconLinks} />
						<Text style={SideBarStyles.textLinks}>{this.props.screenProps.t('sidebar:help')}</Text>
					</TouchableOpacity>
				</View>
				<LinearGradient colors={[SignOutBox.colorSecondary, SignOutBox.colorPrimary]} style={[ContainerStyles.flexColumn, SideBarStyles.signOutBox]}>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
						<Text style={SideBarStyles.signOut}>{this.props.screenProps.t('sidebar:signOut')}</Text>
					</TouchableOpacity>
				</LinearGradient>
			</Container>
		);
	}
}

export default SideBar;
