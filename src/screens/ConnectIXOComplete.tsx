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

const SuccessView = ({ navigation }: { navigation: any }) => (
  <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
    <LogoView />
    <View style={ContainerStyles.flexRow}>
        <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 24 }}>Connected!</Text>
    </View>
    <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
        <View style={[ContainerStyles.flexColumn]}>
            <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 20 }}>Secure your app with a password.</Text>
            <Button onPress={() => navigation.navigate('Login')} style={ConnectIXOStyles.buttons} bordered dark><Text>Unlock</Text></Button>
        </View>
    </View>
  </View>
);

interface PropTypes {
  navigation: any,
};

class ConnectIXOComplete extends React.Component<PropTypes, {}, {}> {
  render() {
    return (
      <View style={ConnectIXOStyles.wrapper}>
        <StatusBar barStyle="dark-content" />
          <SuccessView navigation={this.props.navigation} />
      </View>
    );
  }
}

export default ConnectIXOComplete;
