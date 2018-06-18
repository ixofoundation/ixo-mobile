import React from 'react';
import { View, StatusBar, Image } from 'react-native';
import { Text, Button } from 'native-base';

import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';
import Colors from '../styles/Colors';

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

export default class ConnectIXO extends React.Component<PropTypes> {
  render() {
    return (
      <View style={ConnectIXOStyles.wrapper}>
      <StatusBar barStyle="dark-content" />
          <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
            <LogoView />
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
                <Text style={{ textAlign: 'left', color: Colors.black }}>Connect with ixo</Text>
                <Text style={{ textAlign: 'left', color: Colors.grey }}>1. Open ixo credential manager on your desktop</Text>
                <Text style={{ textAlign: 'left', color: Colors.grey }}>2. Go to account > Show QR code</Text>
                <Text style={{ textAlign: 'left', color: Colors.grey }}>3. Point your phone to the QR code to capture and connect</Text>
              </View>
            </View>
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <View style={[ContainerStyles.flexColumn, { justifyContent: 'space-between' }]}>
                <Button style={ConnectIXOStyles.buttons} bordered dark><Text>Scan QR code</Text></Button>
                <View>
                  <Text style={{ textAlign: 'center', color: Colors.grey }}>Please note that you must be a verified ixo user to be able to use the mobile application</Text>
                </View>
              </View>
            </View>
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
              <Button onPress={() => this.props.navigation.navigate('Login')} style={ConnectIXOStyles.buttons} bordered dark><Text>Register Now</Text></Button>
            </View>
          </View>
      </View>
    );
  }
}