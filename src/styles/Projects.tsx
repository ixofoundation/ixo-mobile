import {
  Dimensions,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { width, height } = Dimensions.get('window');
interface Style {
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
  backgroundImage: ViewStyle;
  spinnerCenterRow: ViewStyle;
  spinnerCenterColumn: ViewStyle;
  drawerOpen: ViewStyle;
  fabIcon: ViewStyle;
  myProjectsHeader: TextStyle;
  progressBarContainer: ViewStyle;
  projectStatusContainer: ViewStyle;
  statusBlock: ViewStyle;
  projectSDGContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  projectSDGContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  projectStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBlock: {
    height: 5,
    width: width * 0.06,
  },
  drawerOpen: {
    opacity: 0.4,
    backgroundColor: ThemeColors.black,
  },
  projectBox: {
    margin: 10,
  },
  projectBoxStatusBar: {
    height: '100%',
    width: 5,
  },
  flexLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    fontFamily: 'RobotoCondensed-Regular',
    color: ThemeColors.white,
    fontSize: 29,
    paddingBottom: 20,
  },
  myProjectsHeader: {
    color: ThemeColors.white,
    fontSize: 29,
    paddingBottom: 20,
  },
  textBoxLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderColor: ThemeColors.blue_light,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderBottomWidth: 0.8,
    padding: width * 0.08,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: ThemeColors.grey,
    shadowOpacity: 3.0,
    elevation: 8,
  },
  divider: {
    width: '30%',
    height: 1,
    backgroundColor: ThemeColors.blue_medium,
  },
  infoBox: {
    color: ThemeColors.white,
    fontSize: 18,
    width: width * 0.6,
    paddingVertical: 20,
  },
  projectImage: {
    flex: 1,
    width: '100%',
    height: height * 0.3,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  projectTitle: {
    textAlign: 'left',
    color: ThemeColors.white,
    fontSize: 21,
  },
  projectSuccessfulAmountText: {
    textAlign: 'left',
    color: ThemeColors.blue_light,
    fontSize: 21,
  },
  projectRequiredClaimsText: {
    textAlign: 'left',
    color: ThemeColors.white,
    fontSize: 21,
  },
  projectImpactActionText: {
    textAlign: 'left',
    color: ThemeColors.white,
    fontSize: 17,
  },
  projectLastClaimText: {
    textAlign: 'left',
    color: ThemeColors.blue_lightest,
    fontSize: 14,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: ThemeColors.blue_dark,
  },
  spinnerCenterRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  spinnerCenterColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fabIcon: {
    backgroundColor: ThemeColors.red,
  },
  progressBarContainer: {
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
});

export default styles;
