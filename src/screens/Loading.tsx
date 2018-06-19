import React, { Component } from 'react';
import { Image, View, StyleSheet, StatusBar } from 'react-native';
import {
  Spinner,
  Text
} from 'native-base';

import LoadingStyles from '../styles/Loading';
import ContainerStyles from '../styles/Containers';

import Colors from '../styles/Colors';

const logo = require('../../assets/logo-white.png');

class LoadingScreen extends Component {
  render() {
    return (
      <View style={[ContainerStyles.flexColumn, { backgroundColor: Colors.blue }]}>
        <StatusBar barStyle="light-content" />
        <View style={ContainerStyles.flexColumn}>
          <View style={ContainerStyles.flexRow}>
            <Image resizeMode={'contain'} style={LoadingStyles.logo} source={logo} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text>Loading...</Text>
          <Spinner color={Colors.white} />
        </View>
      </View>
    );
  }
}

export default LoadingScreen;
