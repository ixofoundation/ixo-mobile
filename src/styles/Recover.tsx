import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { height } = Dimensions.get('window');

interface Style {
	button: ViewStyle;
	wrapper: ViewStyle;
	selectedBox: ViewStyle;
	flexLeft: ViewStyle;
	header: TextStyle;
	divider: ViewStyle;
	keyboardContainer: ViewStyle;
	paragraph: TextStyle;
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
	selectedBox: {
		borderColor: ThemeColors.blue_lightest,
		borderWidth: 1,
		justifyContent: 'flex-start',
		flexDirection: 'column',
		alignItems: 'flex-start',
		alignContent: 'flex-start',
	},
	header: {
		color: ThemeColors.blue_lightest,
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
	keyboardContainer: {
		marginBottom: height * 0.1
	},
	paragraph: {
		textAlign: 'left',
		color: ThemeColors.white,
		paddingBottom: 10
	}
});

export default styles;
