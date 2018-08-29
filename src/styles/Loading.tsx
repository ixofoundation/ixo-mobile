import { Dimensions, StyleSheet, ViewStyle } from 'react-native';

const { height, width } = Dimensions.get('window');
interface Style {
	logo: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	logo: {
		width: width * 0.9,
		height: height * 0.1,
		backgroundColor: 'transparent'
	}
});

export default styles;
