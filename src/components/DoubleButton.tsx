import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Text, View } from 'native-base';
import { ButtonDark } from '../styles/Colors';

const DarkButton = ({
  onPress,
  secondOnPress,
  text = '?',
  secondText = '?',
  propStyles = {},
}: {
  onPress: any;
  secondOnPress: any;
  text: string;
  secondText: string;
  propStyles?: any;
}) => (
  <View style={{ width: '100%' }}>
    <LinearGradient
      colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]}
      style={[styles.buttonStyle, propStyles]}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            backgroundColor: 'transparent',
            fontSize: 15,
            color: '#fff',
            paddingLeft: 10,
            fontFamily: 'RobotoCondensed-Regular',
          }}>
          {text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={secondOnPress}>
        <Text
          style={{
            backgroundColor: 'transparent',
            fontSize: 15,
            color: '#fff',
            paddingLeft: 10,
            fontFamily: 'RobotoCondensed-Regular',
          }}>
          {secondText}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

interface Style {
  buttonStyle: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 17,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DarkButton;
