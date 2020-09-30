import {
  Dimensions,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { height, width } = Dimensions.get('window');

interface Style {
  wrapper: ViewStyle;
  slide: ViewStyle;
  logo: ImageStyle;
  buttons: ViewStyle;
  divider: ViewStyle;
  flexLeft: ViewStyle;
  header: TextStyle;
  infoBox: TextStyle;
  forgotPassword: TextStyle;
  fingerImage: ImageStyle;
  globeView: ViewStyle;
  inputIcons: TextStyle;
  logoContainer: ViewStyle;
  infoBoxLong: TextStyle;
  backButton: TextStyle;
  recover: TextStyle;
}

const styles = StyleSheet.create<Style>({
  logoContainer: { alignItems: 'flex-start', marginTop: height * 0.17 },
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: ThemeColors.blue_dark,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.9,
    height: height * 0.1,
    backgroundColor: 'transparent',
  },
  buttons: {
    width: '100%',
    justifyContent: 'center',
  },
  divider: {
    width: '30%',
    height: 1,
    backgroundColor: ThemeColors.blue_medium,
  },
  flexLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    color: ThemeColors.blue_lightest,
    fontSize: 29,
    paddingBottom: 20,
    fontFamily: 'RobotoCondensed-Regular',
  },
  infoBox: {
    color: ThemeColors.white,
    fontSize: 15,
    width: width * 0.6,
    paddingTop: 20,
    paddingBottom: 0,
  },
  infoBoxLong: {
    color: ThemeColors.white,
    fontSize: 15,
    width: width * 0.9,
    paddingVertical: 20,
  },
  forgotPassword: {
    textAlign: 'left',
    color: ThemeColors.blue_medium,
    paddingBottom: 20,
    paddingTop: 20,
    textDecorationLine: 'underline',
  },
  fingerImage: {
    width: width * 0.12,
    height: width * 0.12,
  },
  globeView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: height * 0.2,
    right: 0,
  },
  inputIcons: {
    position: 'relative',
    top: 10,
    paddingRight: 10,
    fontSize: height * 0.04,
    color: ThemeColors.blue_lightest,
  },
  backButton: {
    paddingLeft: height * 0.02,
    paddingTop: height * 0.05,
    color: ThemeColors.white,
    fontSize: 20,
  },
  recover: {
    marginVertical: height * 0.02,
    color: ThemeColors.blue_lightest,
    fontSize: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default styles;
