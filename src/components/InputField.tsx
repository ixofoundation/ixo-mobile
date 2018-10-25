import * as React from 'react';
import { View } from 'react-native';
import { TextField } from 'react-native-material-textfield';

import { ThemeColors } from '../styles/Colors';

export enum InputColorTypes {
	Light,
	Dark
}

const darkPalettes = {
	baseColor: ThemeColors.blue_lightest,
	errorColor: ThemeColors.red,
	tintColor: ThemeColors.blue_lightest,
	textColor: ThemeColors.white
};

const lightPalettes = {
	baseColor: ThemeColors.black,
	errorColor: ThemeColors.red,
	tintColor: ThemeColors.grey,
	textColor: ThemeColors.grey
};

export const InputField = ({
	password = false,
	value,
	labelName,
	onChangeText,
	icon,
	disable = false,
	colorPalette = InputColorTypes.Dark
}: {
	password?: boolean;
	labelName?: string;
	onChangeText: any;
	value?: string;
	icon?: JSX.Element;
	disable?: boolean;
	colorPalette?: InputColorTypes;
}) =>
	labelName ? (
		<View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
			<TextField
				secureTextEntry={password}
				label={labelName ? labelName : ''}
				value={value ? value : undefined}
				onChangeText={onChangeText}
				baseColor={(colorPalette === InputColorTypes.Dark) ? darkPalettes.baseColor : lightPalettes.baseColor}
				errorColor={(colorPalette === InputColorTypes.Dark) ? darkPalettes.errorColor : lightPalettes.errorColor}
				tintColor={(colorPalette === InputColorTypes.Dark) ? darkPalettes.tintColor : lightPalettes.tintColor}
				textColor={(colorPalette === InputColorTypes.Dark) ? darkPalettes.textColor : lightPalettes.textColor}
				containerStyle={(colorPalette === InputColorTypes.Dark) ? { flex: 0.9 } : { paddingLeft: 20, flex: 0.9 }}
				fontSize={(colorPalette === InputColorTypes.Dark) ? 16 : 20}
				disabledLineWidth={0}
				disabled={disable}
			/>
			{icon ? icon : null}
		</View>
	) : (
		<View>
			<TextField
				secureTextEntry={password}
				value={value ? value : undefined}
				onChangeText={onChangeText}
				baseColor={ThemeColors.blue_lightest}
				errorColor={ThemeColors.red}
				tintColor={ThemeColors.blue_lightest}
				textColor={ThemeColors.white}
			/>
			{icon ? icon : null}
		</View>
	);
