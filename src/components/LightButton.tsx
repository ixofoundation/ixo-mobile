import * as React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Text, View } from 'native-base';

import { ThemeColors } from '../styles/Colors';

const defaultTextStyle = {
  backgroundColor: 'transparent',
  fontSize: 15,
  color: ThemeColors.white,
  fontWeight: '400',
  fontFamily: 'RobotoCondensed-Regular',
};

const LightButton = ({
  onPress,
  text = '?',
  propStyles = {},
  textStyles = {},
}: {
  onPress: any;
  text: string;
  propStyles?: any;
  textStyles?: any;
}) => (
  <TouchableOpacity onPress={onPress} style={{ width: '100%' }}>
    <View style={[styles.buttonStyle, propStyles]}>
      <Text
        style={
          textStyles ? [defaultTextStyle, textStyles] : [defaultTextStyle]
        }>
        {text}
      </Text>
    </View>
  </TouchableOpacity>
);

interface Style {
  buttonStyle: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 17,
    alignItems: 'center',
    borderRadius: 2,
    borderColor: ThemeColors.blue_medium,
    borderWidth: 1,
  },
});

export default LightButton;
