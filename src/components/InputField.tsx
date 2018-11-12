import * as React from 'react';
import { View, ViewStyle } from 'react-native';
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

interface ParentProps {
	password?: boolean;
	labelName?: string;
	onChangeText: any;
	value?: string;
	icon?: JSX.Element;
	disable?: boolean;
	colorPalette?: InputColorTypes;
	prefixIcon?: JSX.Element;
	containerStyle?: ViewStyle;
}

class InputField extends React.Component<ParentProps> {
	render() {
		if (this.props.labelName && !this.props.prefixIcon) {
			return (
				<View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
					<TextField
						secureTextEntry={this.props.password}
						label={this.props.labelName ? this.props.labelName : ''}
						value={this.props.value ? this.props.value : undefined}
						onChangeText={this.props.onChangeText}
						baseColor={this.props.colorPalette || this.props.colorPalette === InputColorTypes.Light ? lightPalettes.baseColor : darkPalettes.baseColor}
						errorColor={this.props.colorPalette || this.props.colorPalette === InputColorTypes.Light ? lightPalettes.errorColor : darkPalettes.errorColor}
						tintColor={this.props.colorPalette || this.props.colorPalette === InputColorTypes.Light ? lightPalettes.tintColor : darkPalettes.tintColor}
						textColor={this.props.colorPalette || this.props.colorPalette === InputColorTypes.Light ? lightPalettes.textColor : darkPalettes.textColor}
						containerStyle={this.props.colorPalette || this.props.colorPalette === InputColorTypes.Light ? { paddingLeft: 20, flex: 1, marginRight: 20 } : { flex: 1 }}
						fontSize={this.props.colorPalette ? 20 : 16}
						disabledLineWidth={0}
						disabled={this.props.disable}
					/>
					{this.props.icon ? this.props.icon : null}
				</View>
			);
		} else if (this.props.labelName && this.props.prefixIcon) {
			return (
				<View style={[this.props.containerStyle]}>
					<View style={[{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}>
						{this.props.prefixIcon ? this.props.prefixIcon : null}
						<TextField
							secureTextEntry={this.props.password}
							label={this.props.labelName ? this.props.labelName : ''}
							value={this.props.value ? this.props.value : undefined}
							onChangeText={this.props.onChangeText}
							baseColor={this.props.colorPalette ? lightPalettes.baseColor : darkPalettes.baseColor}
							errorColor={this.props.colorPalette ? lightPalettes.errorColor : darkPalettes.errorColor}
							tintColor={this.props.colorPalette ? lightPalettes.tintColor : darkPalettes.tintColor}
							textColor={this.props.colorPalette ? lightPalettes.textColor : darkPalettes.textColor}
							containerStyle={this.props.colorPalette ? { flex: 1 } : { flex: 0.9 }}
							fontSize={this.props.colorPalette ? 16 : 20}
							disabled={this.props.disable}
							disabledLineWidth={0}
							lineWidth={0}
							activeLineWidth={0}
						/>
						{this.props.icon ? this.props.icon : null}
					</View>
					<View
						style={
							this.props.containerStyle
								? [{ position: 'relative', top: 20, flexDirection: 'row', alignItems: 'center', height: 1, backgroundColor: ThemeColors.blue_light }]
								: [{ position: 'relative', bottom: 9, flexDirection: 'row', alignItems: 'center', height: 1, backgroundColor: ThemeColors.blue_light }]
						}
					/>
				</View>
			);
		} else {
			return (
				<View>
					<TextField
						secureTextEntry={this.props.password}
						value={this.props.value ? this.props.value : undefined}
						onChangeText={this.props.onChangeText}
						baseColor={ThemeColors.blue_lightest}
						errorColor={ThemeColors.red}
						tintColor={ThemeColors.blue_lightest}
						textColor={ThemeColors.white}
					/>
					{this.props.icon ? this.props.icon : null}
				</View>
			);
		}
	}
}

export default InputField;
