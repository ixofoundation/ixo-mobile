import { Dimensions, ViewStyle, StyleSheet, ImageStyle, Platform, TextStyle } from 'react-native';
import { ThemeColors } from './Colors';

const { height, width } = Dimensions.get('window');
const videoBackgroundColor = Platform.OS === 'ios' ? '#003047' : '#053347';

interface Style {
	wrapper: ViewStyle;
	slide: ViewStyle;
	logo: ImageStyle;
	textBox: ViewStyle;
	textBoxButtonContainer: ViewStyle;
	buttons: ViewStyle;
	dotStyle: ViewStyle;
	videoStyle: ViewStyle;
	onboardingContainer: ViewStyle;
	logoContainer: ViewStyle;
	onboardingHeading: TextStyle;
	onboardingParagraph: TextStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		flex: 1,
		backgroundColor: videoBackgroundColor
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
	textBox: {
		paddingBottom: 33,
		paddingLeft: 60,
		paddingRight: 60
	},
	textBoxButtonContainer: {
		flex: 1.5,
		alignItems: 'center',
		flexDirection: 'column'
	},
	buttons: {
		justifyContent: 'center',
		width: width * 0.8
	},
	dotStyle: {
		width: width * 0.03,
		height: width * 0.03,
		borderRadius: 10
	},
	videoStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 0.5
	},
	onboardingContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1
	},
	logoContainer: {
		alignItems: 'flex-start',
		justifyContent: 'center',
		flexDirection: 'row',
		flex: 0.2
	},
	onboardingHeading: {
		textAlign: 'center',
		color: ThemeColors.blue_lightest,
		paddingBottom: 10,
		fontSize: 28
	},
	onboardingParagraph: {
		textAlign: 'center',
		color: ThemeColors.white,
		paddingBottom: 10,
		fontSize: 18
	}
});

export default styles;
