import * as React from 'react';
import { View, StatusBar, Image, Dimensions } from 'react-native';
import { Text, Button, Item, Label, Input, Icon } from 'native-base';
import { CreateNewVaultAndRestore } from '../utils/sovrin';

import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';

const { width } = Dimensions.get('window');

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

interface StateTypes {
  revealPassword: boolean;
  password: string;
  keysafePasswordCorrect: boolean;
};

class ConnectIXOComplete extends React.Component<PropTypes, StateTypes, {}> {

  state = {
    password: '',
    revealPassword: true,
    keysafePasswordCorrect: false
  };

  revealPassword = () => {
    this.setState({ revealPassword: !this.state.revealPassword })
  }

  createPassword() {

  }

  verifySafeKey() {
    // add decryption here
    this.setState({ keysafePasswordCorrect: true });
  }

  renderKeySafeLinking() {
    return (
      <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>
        
        <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start', justifyContent: 'flex-end', paddingHorizontal: 30, width }]}>
            <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 15 }}>Scan successful!</Text>
            <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 15 }}>Your privacy is of utmost importance.</Text>
            <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 15 }}>Please unlock your ixo information with your ixo Key Safe password.</Text>
        </View>

        <View style={[ContainerStyles.flexRow, { width: width * 0.8, flex: 0.2, paddingBottom: 20 }]}>
          <Item style={{ width: width * 0.8 }} stackedLabel={!this.state.revealPassword} floatingLabel={this.state.revealPassword}>
              <Label>YOUR IXO KEY SAFE PASSWORD</Label>
              <Input value={this.state.password} onChangeText={(password) => this.setState({ password: password })} secureTextEntry={this.state.revealPassword} />
          </Item>
          <Icon onPress={() => this.revealPassword()} active name='eye' style={{ color: ThemeColors.black, top: 10 }} />
        </View>

        <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
            <View style={[ContainerStyles.flexColumn]}>
                <Button onPress={() => this.verifySafeKey()} style={ConnectIXOStyles.buttons} bordered dark><Text>Unlock</Text></Button>
            </View>
        </View>

      </View>
    ); 
  }

  renderCreatePassword() {
    return (
      <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorLight]}>

        <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start', justifyContent: 'flex-end', width, paddingHorizontal: 30 }]}>
            <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 15 }}>Connected!</Text>
            <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 15 }}>Secure your app with a password</Text>
        </View>

        <View style={[ContainerStyles.flexRow, { width: width * 0.8, flex: 0.2, paddingBottom: 20 }]}>
          <Item style={{ width: width * 0.8 }} stackedLabel={!this.state.revealPassword} floatingLabel={this.state.revealPassword}>
              <Label>CREATE PASSWORD</Label>
              <Input value={this.state.password} onChangeText={(password) => this.setState({ password: password })} secureTextEntry={this.state.revealPassword} />
          </Item>
          <Icon onPress={() => this.revealPassword()} active name='eye' style={{ color: ThemeColors.black, top: 10 }} />
        </View>
        
        <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
            <View style={[ContainerStyles.flexColumn]}>
                <Button onPress={() => this.props.navigation.navigate('Login')} style={ConnectIXOStyles.buttons} bordered dark><Text>Unlock</Text></Button>
            </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={ConnectIXOStyles.wrapper}>
        <StatusBar barStyle="dark-content" />
        {(this.state.keysafePasswordCorrect) ? this.renderCreatePassword() : this.renderKeySafeLinking()}
      </View>
    );
  }
}

export default ConnectIXOComplete;
