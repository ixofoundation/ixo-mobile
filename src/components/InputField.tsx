import React from 'react';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { Item, Label, Input } from 'native-base';

import { ThemeColors } from '../styles/Colors';

const InputField = ({ password = false, value = '?', labelName = '?', onChangeText }: { password?: boolean, labelName: string, onChangeText: any, value: string }) => (
    <Item floatingLabel style={styles.itemStyle}>
        <Label  style={styles.lableStyle}>{labelName}</Label>
        <Input secureTextEntry={password} style={styles.inputStyle} value={value} onChangeText={onChangeText} />
    </Item>
)

interface Style {
    itemStyle: ViewStyle,
    lableStyle: TextStyle,
    inputStyle: TextStyle,
}

const styles = StyleSheet.create<Style>({
    itemStyle: {
        borderBottomColor: ThemeColors.blue_lightest,
        marginTop: 10
    },
    lableStyle: {
        color: ThemeColors.blue_lightest,
    },
    inputStyle: {
        color: ThemeColors.white,
    }
});

export default InputField;