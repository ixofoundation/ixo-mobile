import * as React from 'react';
import { View, StatusBar, Image, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import { Text, Button } from 'native-base';

import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';
import DarkButton from '../components/DarkButton';

const logo = require('../../assets/logo.png');
const background = require('../../assets/backgrounds/background_1.jpg');
const keysafelogo = require('../../assets/keysafe-logo.png');
const qr = require('../../assets/qr.png');

const { height, width } = Dimensions.get('window');
const imageSize = width * 0.1;

const LogoView = () => (
  <View style={ContainerStyles.flexColumn}>
    <View style={ContainerStyles.flexRow}>
      <Image resizeMode={'contain'} style={ConnectIXOStyles.logo} source={logo} />
    </View>
  </View>
);

const InfoBlocks = () => (
    <View style={[ContainerStyles.flexRow, { alignItems: 'flex-end', marginBottom: height * 0.04 }]}>
      <View style={[ContainerStyles.flexRow, ConnectIXOStyles.infoBlock]}>
        <Image resizeMode={'contain'} style={ConnectIXOStyles.infoBlockImage} source={keysafelogo}  />
        <Text style={{ color: ThemeColors.white, fontSize: 12, padding: 10, width: width * 0.35 }}>Open the ixo Key Safe on your desktop</Text>
      </View>
      <View style={[ContainerStyles.flexRow, ConnectIXOStyles.infoBlock, { borderLeftWidth: 0 }]}>
        <Image resizeMode={'contain'} style={ConnectIXOStyles.infoBlockImage} source={qr} />
        <Text style={{ color: ThemeColors.white, fontSize: 12, padding: 10, width: width * 0.35 }}>Go to your profile and scan the QR code to connect</Text>
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
        <ImageBackground source={background} style={[ConnectIXOStyles.wrapper, {width: '100%', height: '100%', paddingHorizontal: 10 }]}>
          <StatusBar barStyle="light-content" />
          <View style={[ContainerStyles.flexColumn, { justifyContent: 'space-between'}]}>
            <LogoView />
            <InfoBlocks />
            <DarkButton
              text={'SCAN IXO QR CODE'}
              onPress={() => this.props.navigation.navigate('ScanQR')}
              propStyles={{ marginBottom: height * 0.1 }}
            />
                {/* <Button onPress={() => this.props.navigation.navigate('ScanQR')} style={[ConnectIXOStyles.buttons, { marginBottom: 10 }]} dark><Text>SCAN YOUR QR CODE</Text></Button> */}
                {/* <Button onPress={() => this.props.navigation.dispatch(registerAction)} style={ConnectIXOStyles.buttons} bordered dark><Text>NOT REGISTERED YET?</Text></Button> */}
          </View>
        </ImageBackground>
    );
  }
}