import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { width } = Dimensions.get('window');

interface Style {
	wrapper: ViewStyle;
	photoBoxContainer: ViewStyle;
	photoBoxCloseIcon: TextStyle;
	photoBoxCameraIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		flex: 1
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
	}
});

export default styles;
