import React, { Component } from "react";
import { View, Icon, Text, Container } from 'native-base';
import { Dimensions, Image, TouchableOpacity } from 'react-native';

import ContainerStyles from '../styles/Containers';
import SideBarStyles from '../styles/componentStyles/Sidebar';
import { ThemeColors, ClaimsButton, SignOutBox } from '../styles/Colors';
import { LinearGradient } from 'expo';

const deviceHeight = Dimensions.get('window').height;
const ixoLogo = require('../../assets/logo.png');
const helpIcon = require('../../assets/help.png');
const settingIcon = require('../../assets/settings.png');

interface PropTypes {
  navigation: any,
}

class SideBar extends Component<PropTypes> {
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
                Joyce
              </Text>
              <Text style={SideBarStyles.userDid}>
              0x38950a4bawouyo84uotf… 
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
          <Text style={SideBarStyles.signOut}>
              SIGN OUT
          </Text>
        </LinearGradient>
      </Container>
    );
  }
}

export default SideBar;
