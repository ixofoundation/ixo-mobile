import React from 'react';
import { Fingerprint } from 'expo';
import { View, StatusBar, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Icon } from 'native-base';

import LoginStyles from '../styles/Login';
import ContainerStyles from '../styles/Containers';
import Colors from '../styles/Colors';

const logo = require('../../assets/logo.png');

const LogoView = () => (
  <View style={ContainerStyles.flexColumn}>
    <View style={ContainerStyles.flexRow}>
      <Image resizeMode={'contain'} style={LoginStyles.logo} source={logo} />
    </View>
  </View>
);

interface PropTypes {
  navigation: any,
};

export default class Login extends React.Component<PropTypes> {
  componentDidMount() {
    this.checkDeviceForHardware();
    this.checkForFingerprints();
  }
  
  async checkDeviceForHardware() {
    let compatible = await Fingerprint.hasHardwareAsync();
    this.setState({compatible}) // add these to states when logic is added
  }
  
  async checkForFingerprints() {
    let fingerprints = await Fingerprint.isEnrolledAsync();
    this.setState({fingerprints}) // add these to states when logic is added
  }

  async scanFingerprint() {
    let result = await Fingerprint.authenticateAsync('Authenticate to sign in');
    if (result.success) {
      this.props.navigation.navigate('Projects');
    }
   }

  showAndroidAlert() {
    Alert.alert(
      'Fingerprint Scan',
      'Place your finger over the touch sensor and press scan.',
      [
        {text: 'Scan', onPress: () => {
          this.scanFingerprint();
        }},
        {text: 'Cancel', onPress: () => console.log('Cancel'), style: 'cancel'}
      ]
    )
  }

  render() {
    return (
      <View style={LoginStyles.wrapper}>
      <StatusBar barStyle="dark-content" />
          <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
            <LogoView />
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <View style={[ContainerStyles.flexColumn, { alignItems: 'center' }]}>
                <Text style={{ textAlign: 'center', color: Colors.black }}>Welcome back Mike</Text>
                <Text></Text>
                <Text style={{ textAlign: 'left', color: Colors.black }}>You have 7 alerts for your attention.</Text>
              </View>
            </View>
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <Button onPress={() => this.props.navigation.navigate('Projects')} style={LoginStyles.buttons} bordered dark><Text>Sign in</Text></Button>
            </View>
            <TouchableOpacity onPress={() => Platform.OS === 'android' ? this.showAndroidAlert() : this.scanFingerprint()} >
              <Icon style={{ fontSize: 60 }} ios='ios-finger-print' android="md-finger-print" />
              {/* <Icon name="arrow-back" /> */}
              {/* <Icon type="FontAwesome" name="home" /> */}
            </TouchableOpacity>
            
            <Text style={{ textAlign: 'left', color: Colors.grey, paddingBottom: 20, paddingTop: 20 }}>Forgot your password?</Text>
          </View>
      </View>
    );
  }
}