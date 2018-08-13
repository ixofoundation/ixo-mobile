import React from 'react';
import { LinearGradient } from 'expo';
import { TouchableOpacity, ViewStyle, StyleSheet, Button } from 'react-native';
import { Text } from 'native-base'; 

import { ThemeColors, ButtonDark } from '../styles/Colors';

const DarkButton = ({ onPress, text = '?', propStyles = {} }: { onPress: any, text: string, propStyles?: any }) => (
    <TouchableOpacity onPress={onPress} style={{ width: '100%' }}>
      <LinearGradient
        colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]}
        style={[styles.buttonStyle, propStyles]}>
        <Text
          style={{
            backgroundColor: 'transparent',
            fontSize: 15,
            color: '#fff',
          }}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
);

interface Style {
    buttonStyle: ViewStyle,
}

const styles = StyleSheet.create<Style>({
    buttonStyle: {
        paddingHorizontal: 15,
        paddingVertical: 17,
        alignItems: 'center',
        borderRadius: 2
    }
});

export default DarkButton;