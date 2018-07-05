import React from 'react';
import { Fingerprint } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation'
import { View, StatusBar, Image, Alert, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Text, Button, Icon, Item, Label, Input } from 'native-base';

import LoginStyles from '../styles/Login';
import ContainerStyles from '../styles/Containers';
import { ThemeColors, ProjectStatus } from '../styles/Colors';

const { width } = Dimensions.get('window');
const logo = require('../../assets/logo.png');

const LogoView = () => (
  <View style={ContainerStyles.flexColumn}>
    <View style={ContainerStyles.flexRow}>
      <Image resizeMode={'contain'} style={LoginStyles.logo} source={logo} />
    </View>
  </View>
);

interface PropTypes {
  navigation: any;
};

interface StateTypes {
  revealPassword: boolean;
  compatible: boolean;
  fingerprints: boolean;
  password: string;
};

export default class Login extends React.Component<PropTypes, StateTypes> {

  state = {
    password: '',
    revealPassword: true,
    compatible: false,
    fingerprints: false,
  };

  componentDidMount() {
    this.checkDeviceForHardware();
    this.checkForFingerprints();
  }
  
  async checkDeviceForHardware() {
    let compatible = await Fingerprint.hasHardwareAsync();
    this.setState({ compatible }); // add these to states when logic is added
  }
  
  async checkForFingerprints() {
    let fingerprints = await Fingerprint.isEnrolledAsync();
    this.setState({ fingerprints }); // add these to states when logic is added
  }

  async scanFingerprint() {
    let result = await Fingerprint.authenticateAsync('Authenticate to sign in');
    if (result.success) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Projects'}),
        ]
      });
      this.props.navigation.dispatch(resetAction);
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

  revealPassword = () => {
    this.setState({ revealPassword: !this.state.revealPassword })
  }

  render() {
    return (
      <View style={LoginStyles.wrapper}>
      <StatusBar barStyle="dark-content" />
          <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
            <LogoView />
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <View style={[ContainerStyles.flexColumn, { alignItems: 'center' }]}>
                <Text style={{ textAlign: 'center', color: ThemeColors.black }}>Welcome back Mike</Text>
                <Text></Text>
                <Text style={{ textAlign: 'left', color: ThemeColors.black }}>You have 7 alerts for your attention.</Text>
              </View>
            </View>

            <View style={[ContainerStyles.flexRow, { width: width * 0.8 }]}>
              <Item style={{ width: width * 0.8 }} stackedLabel={!this.state.revealPassword} floatingLabel={this.state.revealPassword}>
                  <Label>Password</Label>
                  <Input value={this.state.password} onChangeText={(password) => this.setState({ password: password })} secureTextEntry={this.state.revealPassword} />
              </Item>
              <Icon onPress={() => this.revealPassword()} active name='eye' style={{ color: ThemeColors.black, top: 10 }} />
            </View>
            
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <Button onPress={() => this.props.navigation.navigate('Projects')} style={LoginStyles.buttons} bordered dark><Text>Sign in</Text></Button>
            </View>
            <TouchableOpacity onPress={() => Platform.OS === 'android' ? this.showAndroidAlert() : this.scanFingerprint()} >
              <Icon onPress={() => this.setState({  })} name='finger-print' style={{ fontSize: 60 }} />
            </TouchableOpacity>
            
            <Text style={{ textAlign: 'left', color: ThemeColors.grey, paddingBottom: 20, paddingTop: 20 }}>Forgot your password?</Text>
          </View>
      </View>
    );
  }
}