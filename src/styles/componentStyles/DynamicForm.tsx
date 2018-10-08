import { Dimensions, StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { ThemeColors } from '../../styles/Colors';

const { width } = Dimensions.get('window');
interface Style {
	formContainer: ViewStyle;
	photoBoxContainer: ViewStyle;
	photoBoxCloseIcon: TextStyle;
	photoBoxCameraIcon: TextStyle;
	imageContainer: ImageStyle;
	textArea: ViewStyle;
	imageType: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	formContainer: {
		flex: 1,
		borderRadius: 1,
		backgroundColor: ThemeColors.white,
		marginBottom: '3%'
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
	imageContainer: {
		width: width * 0.6,
		height: width * 0.6,
		borderColor: ThemeColors.orange,
		borderWidth: 1,
		margin: 3
	},
	imageType: {
		marginTop: 20,
		paddingVertical: 10,
		borderTopColor: ThemeColors.grey,
		borderTopWidth: 1
	},
	textArea: {
		marginTop: 20,
		paddingVertical: 10,
		borderTopColor: ThemeColors.grey,
		borderTopWidth: 1
	}
});

export default styles;
