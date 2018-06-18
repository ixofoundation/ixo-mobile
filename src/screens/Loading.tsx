import React, { Component } from 'react';
import { Image, View, StyleSheet, StatusBar } from 'react-native';
import {
  Spinner,
  Text
} from 'native-base';

import LoadingStyles from '../styles/Loading';
import ContainerStyles from '../styles/Containers';

const logo = require('../../assets/logo-white.png');

class LoadingScreen extends Component {
  render() {
    return (
      <View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColor]}>
        <StatusBar barStyle="light-content" />
        <View style={ContainerStyles.flexColumn}>
          <View style={ContainerStyles.flexRow}>
            <Image resizeMode={'contain'} style={LoadingStyles.logo} source={logo} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text>Welcome loading...</Text>
          <Spinner color={'white'} />
        </View>
      </View>
    );
  }
}

export default LoadingScreen;
