import {
  Dimensions,
  Platform,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { width, height } = Dimensions.get('window');

interface Style {
  ClaimBox: ViewStyle;
  DeleteButton: ViewStyle;
  DeleteButtonText: TextStyle;
  SubmitButton: ViewStyle;
  BadgeBoxContainer: ViewStyle;
  BoxContainer: ViewStyle;
  Badge: ViewStyle;
  backgroundImage: ViewStyle;
  flexLeft: ViewStyle;
  divider: ViewStyle;
  infoBox: TextStyle;
  header: TextStyle;
  claimListItemContainer: ViewStyle;
  claimColorBlock: ViewStyle;
  claimCreated: TextStyle;
  claimTitle: TextStyle;
  claimStatusIcons: ImageStyle;
  claimHeadingContainer: ViewStyle;
  claimHeadingText: TextStyle;
  tabCounterContainer: ViewStyle;
  tabCounterText: TextStyle;
  imageContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  DeleteButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: ThemeColors.grey,
    borderLeftWidth: 0,
  },
  DeleteButtonText: {
    color: ThemeColors.white,
    fontSize: Platform.OS === 'ios' ? 13 : 10,
    fontWeight: '700',
  },
  ClaimBox: {
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingBottom: 15,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: ThemeColors.blue_border,
    marginTop: 10,
    width: '97%',
  },
  SubmitButton: {
    borderTopWidth: 1,
    borderColor: ThemeColors.grey,
    height: height * 0.1,
    backgroundColor: ThemeColors.white,
  },
  BadgeBoxContainer: {
    borderWidth: 1,
    borderColor: ThemeColors.grey_sync,
    borderRadius: 20,
    justifyContent: 'flex-start',
    backgroundColor: ThemeColors.grey_sync,
    marginLeft: 10,
    marginRight: 10,
  },
  Badge: {
    backgroundColor: ThemeColors.white,
    borderRadius: 30,
    flex: 0.32,
  },
  BoxContainer: {
    borderWidth: 1,
    borderColor: ThemeColors.black,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: ThemeColors.blue_dark,
  },
  flexLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  divider: {
    width: '30%',
    height: 1,
    backgroundColor: ThemeColors.blue_medium,
  },
  infoBox: {
    color: ThemeColors.white,
    fontSize: 18,
    width: width * 0.8,
    paddingVertical: 20,
  },
  header: {
    fontSize: 29,
    paddingBottom: 20,
    color: ThemeColors.blue_lightest,
    fontFamily: 'RobotoCondensed-Regular',
  },
  claimListItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    alignItems: 'center',
  },
  claimColorBlock: {
    width: 5,
    height: '40%',
  },
  claimCreated: {
    color: ThemeColors.blue_lightest,
    fontSize: 11,
    paddingTop: 5,
  },
  claimTitle: {
    color: ThemeColors.white,
    fontSize: 20,
  },
  claimStatusIcons: {
    width: width * 0.05,
    height: width * 0.05,
  },
  claimHeadingContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  claimHeadingText: {
    fontFamily: 'RobotoCondensed-Regular',
    color: ThemeColors.white,
    paddingLeft: 10,
  },
  tabCounterContainer: {
    backgroundColor: ThemeColors.red,
    padding: 4,
    borderRadius: 10,
  },
  tabCounterText: {
    fontSize: 13,
    color: ThemeColors.white,
  },
  imageContainer: {
    height: height * 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default styles;
