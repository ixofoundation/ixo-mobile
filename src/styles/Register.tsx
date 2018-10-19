import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const deviceHeight = Dimensions.get('window').height;

interface Style {
	button: ViewStyle;
	selected: ViewStyle;
	unSelect: ViewStyle;
	wrapper: ViewStyle;
	selectedBox: ViewStyle;
	wordBox: TextStyle;
	wordBoxGradient: ViewStyle;
	flexLeft: ViewStyle;
	header: TextStyle;
	divider: ViewStyle;
	recoverText: TextStyle;
	recoverTextContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		flex: 1,
		width: '100%',
		height: '100%',
		paddingHorizontal: 10,
		backgroundColor: ThemeColors.blue_dark
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		marginTop: 20
	},
	selected: {
		borderColor: ThemeColors.blue_lightest,
		borderWidth: 1,
		height: deviceHeight * 0.2,
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 10
	},
	unSelect: {
		height: deviceHeight * 0.2,
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 10
	},
	selectedBox: {
		backgroundColor: ThemeColors.blue_dark,
		borderColor: ThemeColors.blue_lightest,
		borderWidth: 1,
		height: deviceHeight * 0.2,
		justifyContent: 'center'
	},
	wordBox: {
		borderColor: ThemeColors.blue_lightest,
		borderWidth: 1,
		padding: 4,
		margin: 4,
		color: ThemeColors.white
	},
	wordBoxGradient: {
		borderColor: ThemeColors.blue_lightest,
		borderWidth: 1,
		padding: 4,
		margin: 4
	},
	header: {
		color: ThemeColors.blue_lightest,
		fontFamily: 'RobotoCondensed-Regular',
		fontSize: 20,
		paddingBottom: 15,
		fontWeight: '500',
		flex: 0.7
	},
	flexLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		width: '100%'
	},
	divider: {
		width: '30%',
		height: 1,
		backgroundColor: ThemeColors.blue_medium,
		marginBottom: 15
	},
	recoverText: {
		color: ThemeColors.blue_lightest,
		fontSize: 12,
		textDecorationLine: 'underline',
		textAlign: 'center'
	},
	recoverTextContainer: {
		marginTop: 20,
		alignItems: 'center',
	},
});

export default styles;
