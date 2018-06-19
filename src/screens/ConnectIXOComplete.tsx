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

export default class ConnectIXOComplete extends React.Component<PropTypes> {
  render() {
    return (
      <View style={ConnectIXOStyles.wrapper}>
      <StatusBar barStyle="dark-content" />
          <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
            <LogoView />
            <View style={ContainerStyles.flexRow}>
                <Text style={{ textAlign: 'left', color: Colors.black, fontSize: 24 }}>Connected!</Text>
            </View>
            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
                <View style={[ContainerStyles.flexColumn]}>
                    <Text style={{ textAlign: 'left', color: Colors.black, paddingBottom: 20 }}>Secure your app with a password.</Text>
                    <Button onPress={() => this.props.navigation.navigate('Login')} style={ConnectIXOStyles.buttons} bordered dark><Text>Unlock</Text></Button>
                </View>
            </View>
          </View>
      </View>
    );
  }
}