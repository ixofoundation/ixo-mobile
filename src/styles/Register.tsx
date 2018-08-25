import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

import { ThemeColors } from '../styles/Colors';

const deviceHeight = Dimensions.get('window').height;

interface Style {
	button: ViewStyle;
	selected: ViewStyle;
	unSelect: ViewStyle;
	wrapper: ViewStyle;
	selectedBox: ViewStyle;
	wordBox: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	wrapper: {
		padding: 20,
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1
	},
	button: {
		width: '100%',
		justifyContent: 'center'
	},
	selected: {
		borderColor: ThemeColors.blue_light,
		borderWidth: 2,
		height: deviceHeight * 0.3,
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 10
	},
	unSelect: {
		height: deviceHeight * 0.3,
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 10
	},
	selectedBox: {
		borderColor: ThemeColors.white,
		borderWidth: 2,
		height: deviceHeight * 0.3,
		justifyContent: 'center'
	},
	wordBox: {
		borderColor: ThemeColors.white,
		borderWidth: 1,
		padding: 4,
		margin: 4
	}
});

export default styles;
