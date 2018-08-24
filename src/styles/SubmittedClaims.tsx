import { StyleSheet, ViewStyle, Dimensions, TextStyle } from 'react-native';

import { ThemeColors } from '../styles/Colors';
const { width, height } = Dimensions.get('window');

interface Style {
  backgroundImage: ViewStyle,
  header: TextStyle,
  flexLeft: ViewStyle,
  divider: ViewStyle,
  infoBox: TextStyle,
}

const styles = StyleSheet.create<Style>({
  backgroundImage: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: ThemeColors.blue_dark
	},
  header: {
		color: ThemeColors.white,
		fontSize: 29,
		paddingBottom: 20
  },
  flexLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		width: '100%'
  },
  divider: {
		width: '30%',
		height: 1,
		backgroundColor: ThemeColors.blue_medium
  },
  infoBox: {
		color: ThemeColors.white,
		fontSize: 18,
		width: width * 0.6,
		paddingVertical: 20
	},
});

export default styles;