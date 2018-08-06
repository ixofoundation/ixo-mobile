import React from "react";
import { Modal, Dimensions, AsyncStorage, StatusBar, Image } from 'react-native';
import { Camera, Permissions } from "expo";
import { View, Text, Icon, Item, Label, Input, Button } from "native-base";
import { SecureStore } from "expo";

import { ThemeColors } from "../styles/Colors";
import ModalStyle from '../styles/Modal';
import { ISovrinDid, IMnemonic } from "../models/sovrin";
import { Decrypt, Encrypt, generateSovrinDID } from "../utils/sovrin";
import { SecureStorageKeys, LocalStorageKeys } from '../models/phoneStorage';
import { StackActions, NavigationActions } from 'react-navigation';

import LightButton from '../components/LightButton';
import IconEyeOff from '../../assets/svg/IconEyeOff';
const keysafelogo = require('../../assets/keysafe-logo.png');

const { height, width } = Dimensions.get("window");

interface ParentProps {
  navigation: any;
}

interface State {
  hasCameraPermission: boolean;
  type: string;
  qrFound: boolean;
  loading: boolean;
  modalVisible: boolean;
  password: string;
  revealPassword: boolean;
  payload: IMnemonic | null;
  errors: boolean;
}

export default class ScanQR extends React.Component<ParentProps, State> {
  static navigationOptions = () => {
    return {
      headerStyle: {
        backgroundColor: ThemeColors.blue,
        borderBottomColor: ThemeColors.blue,
      },
      headerRight: <Icon style={{ paddingRight: 10, color: ThemeColors.white }} name="flash" />,
      title: "Scan",
      headerTitleStyle: {
        color: ThemeColors.white,
        textAlign: "center",
        alignSelf: "center"
      },
      headerTintColor: ThemeColors.white
    };
  };

  state = {
    hasCameraPermission: false,
    type: Camera.Constants.Type.back,
    qrFound: false,
    loading: false,
    modalVisible: false,
    password: '',
    revealPassword: true,
    payload: null,
    errors: false,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  _handleBarCodeRead = (payload: any) => {
    if (!this.state.modalVisible) {
      this.setState({ modalVisible: true, payload: payload.data });
    }
  };

  handleUnlock = () => {
    if (this.state.payload && this.state.password) {
      try {
        const mnemonicJson: IMnemonic = Decrypt(this.state.payload, this.state.password);
        const cipherTextSovrinDid = Encrypt(JSON.stringify(generateSovrinDID(mnemonicJson.mnemonic)), this.state.password); // encrypt securely on phone enlave

        SecureStore.setItemAsync(SecureStorageKeys.mnemonic, this.state.payload);
        SecureStore.setItemAsync(SecureStorageKeys.sovrinDid, cipherTextSovrinDid);
        SecureStore.setItemAsync(SecureStorageKeys.password, this.state.password);
        AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true');
        
        this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login'}),
          ]
        }));
      } catch (exception) {
        console.log(exception);
        this.setState({ errors: true });
      }
    }
  }

  handleResetScan = () => {
    this.setState({ password: '', modalVisible: false, payload: null, errors: false });
  }

  setModalVisible(visible: boolean) {
    this.setState({ modalVisible: visible });
  }
  
  renderModal() {
    const registerAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Register'}),
      ]
    });
    if (!this.state.errors) {
      return ( // successful
        <View style={ModalStyle.modalOuterContainer}>
          <View style={ModalStyle.modalInnerContainer}>
            <View style={ModalStyle.flexRight}>
              <Icon onPress={() => this.setModalVisible(false)} active name='close' style={{ color: ThemeColors.white, top: 10, fontSize: 30 }} />
            </View>
            <View style={ModalStyle.flexLeft}>
              <Text style={{ color: ThemeColors.blue_lightest, fontSize: 35 }}>Scan successful</Text>
            </View>
            <View style={ModalStyle.divider} />
            <View style={ModalStyle.flexLeft}>
              <Text style={{ color: ThemeColors.white, fontSize: 20 }}>Unlock your existing ixo profile with your ixo Key Safe password.</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20 }}>
              <Image resizeMode={'contain'} style={{ width: width * 0.06, height: width * 0.06 }} source={keysafelogo}  />
              <Item style={{ flex: 1 }} stackedLabel={!this.state.revealPassword} floatingLabel={this.state.revealPassword}>
                <Label style={{ color: ThemeColors.blue_lightest }}>Password</Label>
                <Input value={this.state.password} onChangeText={(password) => this.setState({ password })} secureTextEntry={this.state.revealPassword} />
              </Item>
              <IconEyeOff width={width * 0.06} height={width * 0.06} />
              {/* <Icon onPress={() => this.setState({ revealPassword: !this.state.revealPassword })} active name='eye' style={{ color: ThemeColors.black, top: 10 }} /> */}
            </View>
            <LightButton onPress={() => this.handleUnlock()} text={'UNLOCK'} />
            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
              <Button onPress={() => this.handleUnlock()} bordered dark style={{ width: '100%', justifyContent: 'center' }}><Text>UNLOCK</Text></Button>
            </View> */}
          </View>
        </View>
      );
    }
    return (
      <View style={ModalStyle.modalOuterContainer}>
        <View style={ModalStyle.modalInnerContainer}>
          <View style={ModalStyle.flexRight}>
            <Icon onPress={() => this.setModalVisible(false)} active name='close' style={{ color: ThemeColors.black, top: 10 }} />
          </View>
          <View style={ModalStyle.flexLeft}>
            <Text style={{ color: ThemeColors.black, fontSize: 28 }}>Scan unsuccessful</Text>
          </View>
          <View style={ModalStyle.flexLeft}>
            <Text style={{ color: ThemeColors.black, fontSize: 20 }}>There has been an error connecting to the ixo Key Safe</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
            <Button onPress={() => this.handleResetScan()} bordered dark style={{ width: '100%', justifyContent: 'center' }}><Text>TRY AGAIN</Text></Button>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
            <Text onPress={() => this.props.navigation.dispatch(registerAction)}>Are you registered?</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, loading } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (loading === true) {
      return <Text>Loading...</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
            {this.renderModal()}
          </Modal>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            onBarCodeRead={this._handleBarCodeRead}
          />
        </View>
      );
    }
  }
}
