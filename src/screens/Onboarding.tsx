import React from 'react';
import { View, StatusBar, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Permissions } from 'expo';
import { Text, Button } from 'native-base';
import Swiper from 'react-native-swiper';

import OnBoardingStyles from '../styles/OnBoarding';
import ContainerStyles from '../styles/Containers';
import Colors from '../styles/Colors';

const logo = require('../../assets/logo-white.png');

const LogoView = () => (
  <View style={ContainerStyles.flexColumn}>
    <View style={ContainerStyles.flexRow}>
      <Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
    </View>
  </View>
);

interface PropTypes {
  navigation: any,
};

export default class OnBoarding extends React.Component<PropTypes> {
  async getNotifications() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
    }
  }

  async getLocation() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
    }
    this.props.navigation.navigate('ConnectIXO');
  }

  render() {
    return (
      <View style={OnBoardingStyles.wrapper}>
      <StatusBar barStyle="light-content" />
        <Swiper activeDotColor={Colors.white} dotColor={Colors.blue_light} showsButtons={false}>
          <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorDark]}>
            <LogoView />
            <View style={{ flex: 1.5 }}>
              <Text style={{ textAlign: 'center' }}>App onboarding screens</Text>
            </View>
          </View>
          <View style={[OnBoardingStyles.slide, ContainerStyles.backgroundColorDark]}>
            <LogoView />
            <View style={OnBoardingStyles.textBoxButtonContainer}>
              <View style={OnBoardingStyles.textBox}>
                <Text style={{ textAlign: 'center' }}>Allow push notifications for important updates</Text>
              </View>
              <View style={[ContainerStyles.flexRow]}>
                <Button style={OnBoardingStyles.buttons} onPress={() => this.getNotifications()} bordered light><Text>Allow notifications</Text></Button>
              </View>
            </View>
          </View>
          <View style={[OnBoardingStyles.slide, ContainerStyles.backgroundColorDark]}>
            <LogoView />
            <View style={OnBoardingStyles.textBoxButtonContainer}>
              <View style={OnBoardingStyles.textBox}>
                <Text style={{ textAlign: 'center' }}>Allow Location for location logging</Text>
              </View>
              <View style={[ContainerStyles.flexRow]}>
                <Button style={OnBoardingStyles.buttons} onPress={() => this.getLocation()} bordered light><Text>Allow location</Text></Button>
              </View>
            </View>
          </View>
        </Swiper>
      </View>
    );
  }
}