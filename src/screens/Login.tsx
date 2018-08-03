import React from 'react';
import { Fingerprint, SecureStore } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation'
import { View, StatusBar, Image, Alert, TouchableOpacity, Platform, Dimensions, AsyncStorage } from 'react-native';
import { Text, Button, Icon, Item, Label, Input, Toast, Spinner } from 'native-base';

import LoginStyles from '../styles/Login';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';
import { SecureStorageKeys, LocalStorageKeys } from '../models/phoneStorage';
import { IMnemonic, ISovrinDid } from '../models/sovrin';
import { Decrypt, generateSovrinDID } from '../utils/sovrin';

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
  loading: boolean;
};

export default class Login extends React.Component<PropTypes, StateTypes> {

  state = {
    password: '',
    revealPassword: true,
    compatible: false,
    fingerprints: false,
    loading: false,
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

  signIn() {
      this.setState({ loading: true });
      SecureStore.getItemAsync(SecureStorageKeys.password).then((password) => { // get phone password from secure store
        if (password === this.state.password) {
          SecureStore.getItemAsync(SecureStorageKeys.mnemonic).then((enryptedMnemonic) => { // get encrypted mnemonic from secure store
            const mnemonicObject: IMnemonic = Decrypt(enryptedMnemonic, this.state.password);
            AsyncStorage.setItem(LocalStorageKeys.mnemonic, JSON.stringify(mnemonicObject), (error) => { // save mnemonic local storage
              if (error) {
                Toast.show({
                  text: 'Login Failed',
                  buttonText: 'OK',
                  type: 'warning',
                  position: 'top'
                });
              } else {
                SecureStore.getItemAsync(SecureStorageKeys.sovrinDid).then((encryptedSovrin) => { // get sovrindid from secure store
                  try {
                    const sovrinObject: ISovrinDid = Decrypt(encryptedSovrin, this.state.password);
                    AsyncStorage.setItem(LocalStorageKeys.sovrinDid, sovrinObject.did, (error) => { // save sovrindid id local storage
                      if (error) {
                        Toast.show({
                          text: 'Login Failed',
                          buttonText: 'OK',
                          type: 'warning',
                          position: 'top'
                        });
                      } else {
                        this.props.navigation.dispatch(StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({ routeName: 'Projects'}),
                          ]
                        }));
                      }
                    });
                  } catch(exception) {
                    console.log(exception);
                  }
                });
              }
            });
          });
        } else {
          Toast.show({
            text: 'Password incorrect',
            buttonText: 'OK',
            type: 'warning',
            position: 'top'
          });
          this.setState({ loading: false });
        }
      }).catch(() => {
        Toast.show({
          text: 'Login Failed',
          buttonText: 'OK',
          type: 'warning',
          position: 'top'
        });
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <View style={LoginStyles.wrapper}>
      <StatusBar barStyle="dark-content" />
        <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
          <LogoView />
          <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft, { flex: 0.3 }]}>
            <View style={[ContainerStyles.flexColumn, { alignItems: 'center' }]}>
              <Text style={{ textAlign: 'center', color: ThemeColors.black }}>Welcome back Mike</Text>
              <Text></Text>
              <Text style={{ textAlign: 'left', color: ThemeColors.black }}>You have 7 alerts for your attention.</Text>
            </View>
          </View>

          <View style={[ContainerStyles.flexRow, { width: width * 0.8, flex: 0.2 }]}>
            <Item style={{ width: width * 0.8 }} stackedLabel={!this.state.revealPassword} floatingLabel={this.state.revealPassword}>
                <Label>Password</Label>
                <Input value={this.state.password} onChangeText={(password) => this.setState({ password: password })} secureTextEntry={this.state.revealPassword} />
            </Item>
            <Icon onPress={() => this.revealPassword()} active name='eye' style={{ color: ThemeColors.black, top: 10 }} />
          </View>
          
          <View style={[ContainerStyles.flexRow, { flex: 0.5, paddingTop: 20, marginHorizontal: 20 }]}>
            {(this.state.loading) ? <Spinner color={ThemeColors.black} /> : <Button onPress={() => this.signIn()} style={LoginStyles.buttons} bordered dark><Text>Sign in</Text></Button>}
          </View>
          <TouchableOpacity onPress={() => Platform.OS === 'android' ? this.showAndroidAlert() : this.scanFingerprint()} >
            <Icon name='finger-print' style={{ fontSize: 60 }} />
          </TouchableOpacity>
          
          <Text style={{ textAlign: 'left', color: ThemeColors.grey, paddingBottom: 20, paddingTop: 20 }}>Forgot your password?</Text>
        </View>
      </View>
    );
  }
}