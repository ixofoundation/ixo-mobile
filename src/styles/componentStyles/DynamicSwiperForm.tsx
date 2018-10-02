import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../../styles/Colors';

const { width, height } = Dimensions.get('window');
interface Style {
	formContainer: ViewStyle;
	photoBoxContainer: ViewStyle;
	photoBoxCloseIcon: TextStyle;
	photoBoxCameraIcon: TextStyle;
	imageContainer: ViewStyle;
	questionHeader: TextStyle;
	header: TextStyle;
	outerCardContainer: ViewStyle;
	innerCardContainer: ViewStyle;
	outerCardContainerActive: ViewStyle;
}

const styles = StyleSheet.create<Style>({
	formContainer: {
		flex: 1,
		borderRadius: 1,
		backgroundColor: ThemeColors.white,
		marginBottom: '3%'
	},
	photoBoxContainer: {
		height: width / 4,
		borderWidth: 2,
		borderColor: '#00D2FF',
		borderStyle: 'dashed',
		margin: 10,
		padding: 4
	},
	photoBoxCloseIcon: {
		color: ThemeColors.grey,
		fontSize: 15
	},
	photoBoxCameraIcon: {
		color: '#00D2FF',
		fontSize: 50
	},
	imageContainer: {
		width: width * 0.6,
		height: width * 0.6,
		borderColor: ThemeColors.orange,
		borderWidth: 1,
		margin: 3
	},
	questionHeader: {
		color: ThemeColors.blue_lightest,
		fontSize: height * 0.025,
		paddingBottom: 10,
		fontFamily: 'RobotoCondensed-Regular'
	},
	header: {
		color: ThemeColors.white,
		fontSize: height * 0.04,
		paddingBottom: 20
	},
	innerCardContainer: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		paddingTop: height * 0.2,
		paddingHorizontal: width * 0.05,
	},
	outerCardContainerActive: {
		position: 'absolute',
		height: height - 160,
		top: 30,
		alignSelf: 'center',
		width: '85%',
		flex: 1,
		borderRadius: 1,
		marginBottom: '3%'
	},
	outerCardContainer: {
		width: '110%',
		position: 'absolute',
		height: height - 160,
		top: 30,
		alignSelf: 'center',
		flex: 1,
		borderRadius: 1,
		marginBottom: '3%'
	},
});

export default styles;
