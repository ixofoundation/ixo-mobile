import React, { Component } from 'react';
import { LinearGradient } from 'expo';
import { View, Icon, Text, Container } from 'native-base';
import { Dimensions, Image, TouchableOpacity, AsyncStorage } from 'react-native';


import ContainerStyles from '../styles/Containers';
import SideBarStyles from '../styles/componentStyles/Sidebar';
import { ThemeColors, ClaimsButton, SignOutBox } from '../styles/Colors';
import { UserStorageKeys } from '../models/phoneStorage';
const ixoLogo = require('../../assets/logo.png');
const helpIcon = require('../../assets/help.png');
const settingIcon = require('../../assets/settings.png');

interface PropTypes {
  navigation: any,
}

interface StateTypes {
  name: string;
  did: string;
}

class SideBar extends Component<PropTypes, StateTypes> {

  state = {
    name: '',
    did: '',
  }

  async retrieveUserFromStorage() {
		try {
			const name = await AsyncStorage.getItem(UserStorageKeys.name);
      const did = await AsyncStorage.getItem(UserStorageKeys.did);
      this.setState({ name, did })
		} catch (error) {
			console.error(error);
		}
  }
  
  componentDidMount() {
    this.retrieveUserFromStorage();
  }

  render() {
    return (
      <Container style={[ContainerStyles.flexColumn, { backgroundColor: ThemeColors.blue }]}>
        <LinearGradient
          style={SideBarStyles.userInfoBox}
          colors={[ClaimsButton.colorSecondary, ClaimsButton.colorPrimary]}
        >
          <View style={[ContainerStyles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Icon onPress={() => this.props.navigation.closeDrawer()} style={SideBarStyles.closeDrawer} name="close" />
            <Image source={ixoLogo} style={SideBarStyles.ixoLogo} />
          </View>
          <View style={[ContainerStyles.flexRow, { justifyContent: 'flex-start', width: '100%', paddingTop: 10 }]}>
            <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
              <Text style={SideBarStyles.userName}>
                {this.state.name}
              </Text>
              <Text style={SideBarStyles.userDid}>
                {this.state.did} 
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View style={[ContainerStyles.flexColumn, SideBarStyles.linksBox]}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')} style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
            <Image source={settingIcon} style={SideBarStyles.iconLinks} />
            <Text style={SideBarStyles.textLinks}>
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Help')} style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
          <Image source={helpIcon} style={SideBarStyles.iconLinks} />
            <Text style={SideBarStyles.textLinks}>
              Help
            </Text>
          </TouchableOpacity>
        </View>
        <LinearGradient colors={[SignOutBox.colorSecondary, SignOutBox.colorPrimary]} style={[ContainerStyles.flexColumn, SideBarStyles.signOutBox]}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('OnBoarding')}>
            <Text style={SideBarStyles.signOut}>
                SIGN OUT
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Container>
    );
  }
}

export default SideBar;
