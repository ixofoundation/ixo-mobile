import { Dimensions, StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { ThemeColors } from '../../styles/Colors';

const { height, width } = Dimensions.get('window');

interface Style {
	userInfoBox: ViewStyle;
	closeDrawer: TextStyle;
	userName: TextStyle;
	userDid: TextStyle;
	linksBox: ViewStyle;
	iconLinks: ImageStyle;
	textLinks: TextStyle;
	signOut: TextStyle;
	linkBox: ViewStyle;
	ixoLogo: ImageStyle;
	signOutBox: ViewStyle;
	userBox: ViewStyle;
	wrapper: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		backgroundColor: ThemeColors.blue
	},
	userInfoBox: {
		width: '100%',
		flex: 0.2,
		padding: height * 0.05
	},
	closeDrawer: {
		color: 'white',
		fontSize: height * 0.02
	},
	userBox: {
		paddingTop: height * 0.01,
		justifyContent: 'flex-start',
		width: '100%'
	},
	userName: {
		marginBottom: height * 0.01,
		fontSize: height * 0.03,
		color: ThemeColors.white,
		textAlign: 'left'
	},
	userDid: {
		fontSize: height * 0.02,
		color: ThemeColors.blue_lightest
	},
	linksBox: {
		marginTop: height * 0.01,
		paddingLeft: width * 0.09,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		width: '100%',
		backgroundColor: ThemeColors.blue,
		flex: 0.7
	},
	iconLinks: {
		width: height * 0.03,
		height: height * 0.03
	},
	textLinks: {
		paddingLeft: 10,
		fontSize: height * 0.03,
		color: ThemeColors.white
	},
	signOut: {
		fontSize: height * 0.02,
		color: ThemeColors.white
	},
	ixoLogo: {
		width: height * 0.07,
		height: height * 0.041
	},
	linkBox: {
		justifyContent: 'flex-start',
		flex: 0.1,
		marginVertical: height * 0.01
	},
	signOutBox: {
		width: '100%',
		backgroundColor: 'red',
		flex: 0.1,
		alignItems: 'flex-start',
		padding: height * 0.05
	}
});

export default styles;
