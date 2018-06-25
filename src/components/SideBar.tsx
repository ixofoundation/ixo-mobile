import React from 'react';
import { View, Text } from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';

import { ThemeColors } from '../styles/Colors';

const deviceHeight = Dimensions.get('window').height;

interface PropTypes {
  navigation: any,
}

class SideBar extends React.Component<PropTypes> {
  render() {
    return (
      <View style={{ backgroundColor: ThemeColors.white, height: deviceHeight, paddingTop: 40, paddingLeft: 20 }}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}><Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500', padding: 5 }}>Settings</Text></TouchableOpacity>
        <TouchableOpacity><Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500', padding: 5 }}>Help</Text></TouchableOpacity>
      </View>
    );
  }
}

export default SideBar;
