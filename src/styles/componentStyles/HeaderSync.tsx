import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeColors } from '../../styles/Colors';

interface Style {
	headerSync: ViewStyle;
	claimsAmount: TextStyle;
	syncIcon: TextStyle;
}

const styles = StyleSheet.create<Style>({
	headerSync: {
		paddingLeft: 10,
		backgroundColor: ThemeColors.red,
		height: 30,
		borderRadius: 30,
		marginRight: 10
	},
	claimsAmount: {
		color: ThemeColors.white,
		paddingRight: 5
	},
	syncIcon: {
		marginRight: 10,
		fontSize: 20,
		color: ThemeColors.white
	}
});

export default styles;
