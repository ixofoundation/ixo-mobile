import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { width } = Dimensions.get('window');
interface Style {
	headerSaveButton: TextStyle;
	photoBoxContainer: ViewStyle;
	photoBoxCloseIcon: TextStyle;
	photoBoxCameraIcon: TextStyle;
	navigatorContainer: ViewStyle;
	backNavigatorButton: TextStyle;
	claimNavigatorButton: TextStyle;
	nextNavigatorButton: TextStyle;
}

const styles = StyleSheet.create<Style>({
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
	navigatorContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		paddingBottom: 15
	},
	backNavigatorButton: {
		color: ThemeColors.blue_light,
		fontSize: 20,
		alignItems: 'center',
		paddingLeft: 5,
		fontFamily: 'RobotoCondensed-Regular'
	},
	claimNavigatorButton: {
		color: ThemeColors.white,
		fontSize: 20,
		paddingRight: 5,
		fontFamily: 'RobotoCondensed-Regular'
	},
	nextNavigatorButton: {
		color: ThemeColors.white,
		fontSize: 20,
		paddingRight: 5,
		fontFamily: 'RobotoCondensed-Regular'
	},
	headerSaveButton: {
		color: ThemeColors.blue_light,
		paddingRight: 10,
		fontFamily: 'RobotoCondensed-Regular'
	}
});

export default styles;
