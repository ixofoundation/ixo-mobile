import { Dimensions, StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { ThemeColors } from '../../styles/Colors';

const { width } = Dimensions.get('window');
interface Style {
	formContainer: ViewStyle;
	photoBoxContainer: ViewStyle;
	photoBoxCloseIcon: TextStyle;
	photoBoxCameraIcon: TextStyle;
	imageContainer: ImageStyle;
	addImageContainer: ImageStyle;
	removePhoto: ViewStyle;
	removePhotoIcon: TextStyle;
	textArea: ViewStyle;
	imageType: ViewStyle;
	deleteButton: ViewStyle;
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
		width: width * 0.25,
		height: width * 0.25,
		backgroundColor: ThemeColors.blue_dark,
		borderWidth: 1,
		margin: 3
	},
	addImageContainer: {
		width: width * 0.25,
		height: width * 0.25,
		backgroundColor: ThemeColors.white,
		borderWidth: 1,
		borderColor: ThemeColors.blue_lightest,
		margin: 3,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	removePhoto: {
		position: 'absolute',
		right: width * 0.02,
		top: width * 0.01,
		backgroundColor: ThemeColors.black,
		alignItems: 'center',
		zIndex: 100,
		borderColor: ThemeColors.white,
		borderRadius: 10,
		width: width * 0.05,
		height: width * 0.05
	},
	removePhotoIcon: {
		color: ThemeColors.white,
		fontSize: width * 0.05,
		alignSelf: 'center'
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
	},
	deleteButton: {
		marginTop: 20,
		marginBottom: 20
	}
});

export default styles;
