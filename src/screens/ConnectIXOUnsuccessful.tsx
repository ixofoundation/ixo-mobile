import * as React from 'react';
import { View, StatusBar, Image } from 'react-native';
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

const UnSuccessfulView = (navigation: any) => (
  <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
    <LogoView />
    <View style={ContainerStyles.flexRow}>
        <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 20 }}>Your scan has been unsuccessful.</Text>
    </View>
    <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
        <View style={[ContainerStyles.flexColumn, { height: '100%', justifyContent: 'space-between', paddingBottom: 20 }]}>
            <Text style={{ textAlign: 'left', color: ThemeColors.grey }}>Do you have a key?</Text>
            <Button onPress={() => navigation.navigate('Login')} style={ConnectIXOStyles.buttons} bordered dark><Text>Try Again</Text></Button>
            <Text style={{ textAlign: 'left', color: ThemeColors.grey }}>Having issues logging in?</Text>
        </View>
    </View>
  </View>
);

interface PropTypes {
  navigation: any,
};

class ConnectIXOUnsuccessful extends React.Component<PropTypes, {}, {}> {
  render() {
    return (
      <View style={ConnectIXOStyles.wrapper}>
        <StatusBar barStyle="dark-content" />
          <UnSuccessfulView navigation={this.props.navigation} />
      </View>
    );
  }
}

export default ConnectIXOUnsuccessful;