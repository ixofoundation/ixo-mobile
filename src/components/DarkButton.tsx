import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, ViewStyle, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, View, Spinner } from 'native-base';

const { width } = Dimensions.get('window');

import { ButtonDark, ThemeColors } from '../styles/Colors';

const DarkButton = ({
	onPress,
	text = '?',
	propStyles = {},
	iconImage = null,
	disabled = false,
	loading = false
}: {
	onPress: any;
	text: string;
	propStyles?: any;
	iconImage?: any;
	disabled?: boolean;
	loading?: boolean;
}) =>
	loading ? (
		<Spinner color={ThemeColors.white} />
	) : (
		<TouchableOpacity disabled={disabled} onPress={onPress} style={{ width: '100%' }}>
			{disabled ? (
				<View
					style={[
						styles.buttonStyle,
						propStyles,
						{
							borderColor: ThemeColors.blue_lightest,
							borderWidth: 1
						}
					]}
				>
					{iconImage && <Image resizeMode={'contain'} style={{ width: width * 0.08, height: width * 0.08 }} source={iconImage} />}
					<Text
						style={{
							backgroundColor: 'transparent',
							fontSize: 15,
							color: ThemeColors.grey,
							paddingLeft: 10,
							fontFamily: 'RobotoCondensed-Regular'
						}}
					>
						{text}
					</Text>
				</View>
			) : (
				<LinearGradient colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]} style={[styles.buttonStyle, propStyles]}>
					{iconImage && <Image resizeMode={'contain'} style={{ width: width * 0.08, height: width * 0.08 }} source={iconImage} />}
					<Text
						style={{
							backgroundColor: 'transparent',
							fontSize: 15,
							color: ThemeColors.white,
							paddingLeft: 10,
							fontFamily: 'RobotoCondensed-Regular'
						}}
					>
						{text}
					</Text>
				</LinearGradient>
			)}
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
		flexDirection: 'row',
		justifyContent: 'center'
	}
});

export default DarkButton;
