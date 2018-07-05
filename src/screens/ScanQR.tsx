import React from "react";
import { AsyncStorage } from 'react-native';
import { Camera, Permissions } from "expo";
import { View, Text, Icon } from "native-base";
import { SecureStore } from "expo";

import { ThemeColors } from "../styles/Colors";
import { ISovrinDid } from "../models/sovrin";
import { generateSovrinDID } from "../utils/sovrin";
import { LocalStorageKeys } from "../models/phoneStorage";

interface ParentProps {
  navigation: any;
}

interface State {
  hasCameraPermission: boolean;
  type: string;
  qrFound: boolean;
  loading: boolean;
}

export default class ScanQR extends React.Component<ParentProps, State> {
  static navigationOptions = () => {
    return {
      headerRight: <Icon style={{ paddingRight: 10 }} name="flash" />,
      title: "Scan",
      headerTitleStyle: {
        color: ThemeColors.black,
        textAlign: "center",
        alignSelf: "center"
      },
      headerTintColor: ThemeColors.grey
    };
  };

  state = {
    hasCameraPermission: false,
    type: Camera.Constants.Type.back,
    qrFound: false,
    loading: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  _handleBarCodeRead = (payload: any) => {
    // console.log(payload.data);
    // console.log(payload.type);
    let sovrinDid: ISovrinDid;
    sovrinDid = generateSovrinDID(payload.data);
    // console.log(sovrinDid);
    this.setState({ loading: true });
    this.storeDidToKeychain(sovrinDid, JSON.parse(payload.data));
  };

  storeDidToKeychain(sovrinDid: ISovrinDid, { mnemonic }: { mnemonic: string }) {
    // Store the credentials
    let key = sovrinDid.did,
      value = mnemonic;

    SecureStore.setItemAsync(key, value)
      .then(() => {
        AsyncStorage.setItem(LocalStorageKeys.sovrinDid, key).then(() => {
          this.props.navigation.navigate("ConnectIXOComplete");
        });
      })
      .catch(e => {
        this.props.navigation.navigate("ConnectIXOUnsuccessful");
        console.log(
          `Could not save "${key}" with value "${value}" in store (${e})`
        );
      });
    this.retrieveMnemonicFromKeychain(key);
  }

  retrieveMnemonicFromKeychain(key: string) {
    SecureStore.getItemAsync(key).then((response: any) => {
      if (response) {
        console.log("Menmonic: " + response);
      }
    });
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
