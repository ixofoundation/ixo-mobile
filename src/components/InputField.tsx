import * as React from 'react';
import { View } from 'react-native';
import { TextField } from 'react-native-material-textfield';

import { ThemeColors } from '../styles/Colors';

const InputField = ({ password = false, value, labelName, onChangeText, icon }: { password?: boolean; labelName?: string; onChangeText: any; value?: string, icon?: JSX.Element }) =>
	labelName ? (
		<View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
			<TextField
				secureTextEntry={password}
				label={labelName}
				value={value ? value : undefined}
				onChangeText={onChangeText}
				baseColor={ThemeColors.blue_lightest}
				errorColor={ThemeColors.red}
				tintColor={ThemeColors.blue_lightest}
				textColor={ThemeColors.white}
				containerStyle={{ flex: 0.9 }}
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

export default InputField;
