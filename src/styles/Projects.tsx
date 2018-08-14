import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

import { ThemeColors } from '../styles/Colors';

const { width, height } = Dimensions.get('window');

interface Style {
	headerSync: ViewStyle;
	projectBox: ViewStyle;
	projectBoxStatusBar: ViewStyle;
	flexLeft: ViewStyle;
	header: TextStyle;
	textBoxLeft: ViewStyle;
	divider: ViewStyle;
  infoBox: TextStyle;
  projectImage: ViewStyle;
  projectSuccessfulAmountText: TextStyle;
  projectRequiredClaimsText: TextStyle;
  projectImpactActionText: TextStyle;
  projectTitle: TextStyle;
  projectLastClaimText: TextStyle;
}

const styles = StyleSheet.create<Style>({
	headerSync: {
		paddingLeft: 10,
		backgroundColor: ThemeColors.grey_sync,
		height: 30,
		borderRadius: 30,
		marginRight: 10
	},
	projectBox: {
		margin: 10
	},
	projectBoxStatusBar: {
		height: '100%',
		width: 5
	},
	flexLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		width: '100%'
	},
	header: {
		color: ThemeColors.white,
		fontSize: 29,
		paddingBottom: 20
	},
	textBoxLeft: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		borderColor: ThemeColors.blue_light,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderBottomWidth: 1,
		padding: width * 0.05
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
	projectImage: {
		flex: 1,
		width: '100%',
		height: height * 0.3,
		justifyContent: 'flex-end',
		flexDirection: 'row',
		paddingRight: 13
  },
  projectTitle: {
    textAlign: 'left', color: ThemeColors.white, fontSize: 21, fontWeight: '500'
  },
  projectSuccessfulAmountText: {
    textAlign: 'left', color: ThemeColors.blue_light, fontSize: 21
  },
  projectRequiredClaimsText: {
    textAlign: 'left', color: ThemeColors.white, fontSize: 21, fontWeight: '500'
  },
  projectImpactActionText: {
    textAlign: 'left', color: ThemeColors.white, fontSize: 17
  },
  projectLastClaimText: {
    textAlign: 'left', color: ThemeColors.blue_lightest, fontSize: 14
	},
	backgroundImage: {
		flex: 1, 
		width: '100%', 
		height: '100%', 
		paddingHorizontal: 10, 
		backgroundColor: ThemeColors.blue_dark
	}
});

export default styles;
