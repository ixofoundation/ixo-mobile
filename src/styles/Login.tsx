import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

import { ThemeColors } from '../styles/Colors';

const { height, width } = Dimensions.get('window');

interface Style {
  wrapper: ViewStyle,
  slide: ViewStyle,
  logo: ViewStyle,
  buttons: ViewStyle,
  divider: ViewStyle,
  flexLeft: ViewStyle,
  header: TextStyle,
  infoBox: TextStyle,
  forgotPassword: TextStyle,
  fingerImage: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.9,
    height: height * 0.1,
    backgroundColor: 'transparent'
  },
  buttons: {
    width: '100%',
    justifyContent: 'center'
  },
  divider: {
    width: '30%',
    height: 1,
    backgroundColor: ThemeColors.blue_medium,
  },
  flexLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%'
  },
  header: {
    color: ThemeColors.blue_lightest,
    fontSize: 29,
    paddingBottom: 20,
  },
  infoBox: {
    color: ThemeColors.white,
    fontSize: 15,
    width: width * 0.6,
    paddingVertical: 20
  },
  forgotPassword: {
    textAlign: 'left',
    color: ThemeColors.blue_medium,
    paddingBottom: 20,
    paddingTop: 20
  },
  fingerImage: {
    width: width * 0.16,
    height: width * 0.16
  }
});

export default styles;