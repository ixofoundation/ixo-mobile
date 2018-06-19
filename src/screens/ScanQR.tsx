
import React from 'react';
import { Camera, Permissions } from 'expo';
import { View, Text, Icon } from 'native-base';

import Colors from '../styles/Colors';

interface ParentProps {
  navigation: any,
};

interface State {
  hasCameraPermission: boolean,
  type: string,
  qrFound: boolean,
  loading: boolean,
}

export default class ScanQR extends React.Component<ParentProps, State> {
  static navigationOptions = () => {
    return {
      headerRight: (
        <Icon style={{ paddingRight: 10 }} name="flash" />
      ),
      title: 'Scan',
      headerTitleStyle : {
        color: Colors.black,
        textAlign: 'center',
        alignSelf:'center'
      },
      headerTintColor: Colors.grey,
    };
  };

    state = {
      hasCameraPermission: false,
      type: Camera.Constants.Type.back,
      qrFound: false,
      loading: false,
    }

    async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    }

    _handleBarCodeRead = (payload: any) => {
      console.log(payload.data);
      console.log(payload.type);
      this.setState({ loading: true });

      this.props.navigation.navigate('ConnectIXOComplete');
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
              >
              </Camera>
            </View>
          );
        }
  }
}