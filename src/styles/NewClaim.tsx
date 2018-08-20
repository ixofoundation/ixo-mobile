import { StyleSheet, ViewStyle, TextStyle, Dimensions, Platform } from 'react-native';

import { ThemeColors } from '../styles/Colors';
const { width, height } = Dimensions.get('window');

interface Style {
	formContainer: ViewStyle;
	photoBoxContainer: ViewStyle;
	photoBoxCloseIcon: TextStyle;
	photoBoxCameraIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
	formContainer: {
		flex: 1,
		borderRadius: 1,
		backgroundColor: ThemeColors.white,
		marginBottom: '3%',
	},
	photoBoxContainer: {
        width: width / 4,
        height: width / 4,
        borderWidth: 1,
        borderColor: ThemeColors.grey,
        margin: 10,
        padding: 4
	},
	photoBoxCloseIcon: {
        color: ThemeColors.grey,
        fontSize: 15
	},
	photoBoxCameraIcon: {
        color: ThemeColors.grey,
        fontSize: 50
    },
});

export default styles;
