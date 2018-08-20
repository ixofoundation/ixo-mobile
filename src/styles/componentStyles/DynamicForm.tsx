import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

import { ThemeColors } from '../../styles/Colors';
const { width } = Dimensions.get('window');

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
		height: width / 4,
		borderWidth: 2,
		borderColor: '#00D2FF',
		borderStyle: 'dashed',
		margin: 10,
		padding: 4
	},
	photoBoxCloseIcon: {
		color: ThemeColors.grey,
		fontSize: 15
	},
	photoBoxCameraIcon: {
		color: '#00D2FF',
		fontSize: 50
    },
});

export default styles;
