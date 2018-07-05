import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation'
import { View, StatusBar, Image, AsyncStorage } from 'react-native';
import { Permissions } from 'expo';
import { Text, Button } from 'native-base';
import Swiper from 'react-native-swiper';
import Loading from '../screens/Loading';

import OnBoardingStyles from '../styles/OnBoarding';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';
import { LocalStorageKeys } from '../models/phoneStorage';

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

  state = {
    showOnboarding: false,
  };

  componentDidMount() {
    AsyncStorage.getItem(LocalStorageKeys.firstLaunch, (error: any, firstLaunch: string | undefined) => {
      if (!firstLaunch || error) {
        this.setState({ showOnboarding: true });
      } else {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login'}),
          ]
        });
        this.props.navigation.dispatch(resetAction);
      }
    });
  }

  async getNotifications() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
    }
    this.swiper.scrollBy(1);
  }

  async getLocation() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
    }

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'ConnectIXO'}),
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    if (this.state.showOnboarding) {
      return (
        <View style={OnBoardingStyles.wrapper}>
        <StatusBar barStyle="light-content" />
          <Swiper ref={swiper => this.swiper = swiper}  scrollEnabled={false} activeDotColor={ThemeColors.white} dotColor={ThemeColors.blue_light} showsButtons={false}>
            <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorDark]}>
              <LogoView />
              {/* <View style={{ flex: 1.5 }}> */}
              <View>
                <Text style={{ textAlign: 'center', color: ThemeColors.white, paddingBottom: 10 }}>App onboarding screens</Text>
              </View>
              <View style={[ContainerStyles.flexRow]}>
                <Button style={OnBoardingStyles.buttons} onPress={() => this.swiper.scrollBy(1)} bordered light><Text>Begin</Text></Button>
              </View>
            </View>
            <View style={[OnBoardingStyles.slide, ContainerStyles.backgroundColorDark]}>
              <LogoView />
              <View style={OnBoardingStyles.textBoxButtonContainer}>
                <View style={OnBoardingStyles.textBox}>
                  <Text style={{ textAlign: 'center', color: ThemeColors.white }}>Allow push notifications for important updates</Text>
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
                  <Text style={{ textAlign: 'center', color: ThemeColors.white }}>Allow Location for location logging</Text>
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
    return <Loading />;
  }
}