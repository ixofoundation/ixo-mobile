import { Dimensions, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { height, width } = Dimensions.get('window');
interface Style {
	modalOuterContainer: ViewStyle;
	modalInnerContainer: ViewStyle;
	flexRight: ViewStyle;
	flexLeft: ViewStyle;
	divider: ViewStyle;
	cancelIcon: TextStyle;
	headingText: TextStyle;
	descriptionText: TextStyle;
	modalInnerContainerAuto: ViewStyle;
	forgotPassword: TextStyle;
	flexCenter: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	modalOuterContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: height * 0.2,
		backgroundColor: ThemeColors.blue,
		marginHorizontal: width * 0.05,
	},
	modalInnerContainer: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		width: width * 0.8,
		height: height * 0.6,
		paddingBottom: 20
	},
	modalInnerContainerAuto: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		width: width * 0.8,
		height: 'auto',
		paddingBottom: 20
	},
	flexRight: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	flexLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start'
	},
	flexCenter: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	divider: {
		width: '30%',
		height: 1,
		backgroundColor: ThemeColors.blue_medium
	},
	cancelIcon: {
		color: ThemeColors.white,
		top: 10,
		fontSize: 30
	},
	headingText: {
		color: ThemeColors.blue_lightest,
		fontSize: 29,
		fontFamily: 'Roboto_condensed'
	},
	descriptionText: {
		color: ThemeColors.white,
		fontSize: 15,
		marginTop: height * 0.02,
		marginBottom: height * 0.06
	},
	forgotPassword: {
		textAlign: 'left',
		color: ThemeColors.blue_medium,
		paddingBottom: 20,
		paddingTop: 20,
		textDecorationLine: 'underline'
	}
});

export default styles;
