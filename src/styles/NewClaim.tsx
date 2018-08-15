import { StyleSheet, ViewStyle, TextStyle, Dimensions, Platform } from 'react-native';

import { ThemeColors } from '../styles/Colors';
const { width, height } = Dimensions.get('window');

interface Style {
	formContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	formContainer: {
		flex: 1,
		borderRadius: 1,
		backgroundColor: ThemeColors.white,
		marginBottom: '3%',
	}
});

export default styles;
