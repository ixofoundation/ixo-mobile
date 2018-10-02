import { Dimensions, StyleSheet, ViewStyle } from 'react-native';

const { height, width } = Dimensions.get('window');
interface Style {
	wrapper: ViewStyle;
	slide: ViewStyle;
	logo: ViewStyle;
	textBox: ViewStyle;
	textBoxButtonContainer: ViewStyle;
	buttons: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		flex: 1
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
		// justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column'
	},
	buttons: {
		// width: '100%',
		justifyContent: 'center',
		width: width * 0.8
	}
});

export default styles;
