import * as React from 'react';
import { View, StatusBar, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
import { Text, Button } from 'native-base';

import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';

const logo = require('../../assets/logo.png');

const LogoView = () => (
  <View style={ContainerStyles.flexColumn}>
    <View style={ContainerStyles.flexRow}>
      <Image resizeMode={'contain'} style={ConnectIXOStyles.logo} source={logo} />
    </View>
  </View>
);

interface PropTypes {
  navigation: any,
};

export default class ConnectIXO extends React.Component<PropTypes,{}> {
  render() {
    const registerAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Register'}),
      ]
    });
    return (
      <View style={ConnectIXOStyles.wrapper}>
      <StatusBar barStyle="dark-content" />
          <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight, { justifyContent: 'space-between'}]}>
            <LogoView />
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
                <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 13 }}>Connect with ixo</Text>
                <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 13 }}>1. Open ixo credential manager on your desktop</Text>
                <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 13 }}>2. Go to account > Show QR code</Text>
                <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 13 }}>3. Point your phone to the QR code to capture and connect</Text>
              </View>
            </View>
            <View style={[ContainerStyles.flexColumn, ContainerStyles.textBoxLeft ]}>
                <Button onPress={() => this.props.navigation.navigate('ScanQR')} style={[ConnectIXOStyles.buttons, { marginBottom: 10 }]} bordered><Text>SCAN YOUR IXO KEY SAFE QR</Text></Button>
                <Button onPress={() => this.props.navigation.dispatch(registerAction)} style={ConnectIXOStyles.buttons} bordered dark><Text>NOT REGISTERED YET?</Text></Button>
            </View>
          </View>
      </View>
    );
  }
}