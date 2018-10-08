import * as React from 'react';
import { ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { Item, Label, Input } from 'native-base';

import { ThemeColors } from '../styles/Colors';

const InputField = ({ password = false, value, labelName, onChangeText }: { password?: boolean; labelName?: string; onChangeText: any; value?: string }) =>
	labelName ? (
		<Item floatingLabel={true} style={{ borderBottomColor: ThemeColors.blue_lightest, marginTop: 10}}>
			<Label style={{ color: ThemeColors.blue_lightest }}>{labelName}</Label>
			{value ? (
				<Input secureTextEntry={password} style={{ color: ThemeColors.white }} value={value} onChangeText={onChangeText} />
			) : (
				<Input secureTextEntry={password} style={{ color: ThemeColors.white }} onChangeText={onChangeText} />
			)}
		</Item>
	) : (
		<Item style={{ borderBottomColor: ThemeColors.blue_lightest, marginTop: 10}}>
			{value ? (
				<Input secureTextEntry={password} style={{ color: ThemeColors.white }} value={value} onChangeText={onChangeText} />
			) : (
				<Input secureTextEntry={password} style={{ color: ThemeColors.white }} onChangeText={onChangeText} />
			)}
		</Item>
	);

export default InputField;
