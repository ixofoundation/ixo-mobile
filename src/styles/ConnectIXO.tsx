import { Dimensions, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeColors } from './Colors';

const { height, width } = Dimensions.get('window');

interface Style {
	wrapper: ViewStyle;
	slide: ViewStyle;
	logo: ImageStyle;
	buttons: ViewStyle;
	infoBlock: ViewStyle;
	infoBlockImage: ImageStyle;
	recover: TextStyle;
	loginWrapper: ViewStyle;
	globeView: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		flex: 1,
		backgroundColor: ThemeColors.blue_dark
	},
	globeView: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	loginWrapper: {
		flex: 1,
		paddingVertical: 50,
		paddingHorizontal: 20
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	logo: {
		width: width * 0.9,
		height: height * 0.1,
		backgroundColor: 'transparent'
	},
	buttons: {
		width: '100%',
		justifyContent: 'center'
	},
	infoBlock: {
		justifyContent: 'center',
		height: height * 0.1
	},
	infoBlockImage: {
		width: width * 0.08,
		height: width * 0.08
	},
	recover: {
		marginVertical: height * 0.04,
		color: ThemeColors.blue_lightest,
		fontSize: 12,
		textDecorationLine: 'underline',
		textAlign: 'center'
	}
});

export default styles;
