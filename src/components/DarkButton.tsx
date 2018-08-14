import React from 'react';
import { Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo';
import { TouchableOpacity, ViewStyle, StyleSheet, Button } from 'react-native';
import { Text } from 'native-base'; 

const { width, height } = Dimensions.get('window');

import { ButtonDark } from '../styles/Colors';

const DarkButton = ({ onPress, text = '?', propStyles = {}, iconImage = null }: { onPress: any, text: string, propStyles?: any, iconImage?: any }) => (
    <TouchableOpacity onPress={onPress} style={{ width: '100%' }}>
      <LinearGradient
        colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]}
        style={[styles.buttonStyle, propStyles]}>
        {(iconImage) && <Image resizeMode={'contain'} style={{ width: width * 0.08, height: width * 0.08 }} source={iconImage} />}
        <Text
          style={{
            backgroundColor: 'transparent',
            fontSize: 15,
            color: '#fff',
            paddingLeft: 10,
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
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default DarkButton;