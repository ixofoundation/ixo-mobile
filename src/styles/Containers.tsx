import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { width } = Dimensions.get('window');

interface Style {
	flexRow: ViewStyle;
	flexColumn: ViewStyle;
	backgroundColorDark: ViewStyle;
	backgroundColorLight: ViewStyle;
	textBoxLeft: ViewStyle;
	textBoxCenter: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	flexRow: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
	},
	flexColumn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	backgroundColorDark: {
		backgroundColor: ThemeColors.blue
	},
	backgroundColorLight: {
		backgroundColor: ThemeColors.white
	},
	textBoxLeft: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		width: width * 0.8
	},
	textBoxCenter: {
		alignItems: 'center',
		justifyContent: 'center',
		width: width * 0.6
	}
});

export default styles;
