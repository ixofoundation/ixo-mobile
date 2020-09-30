import { Dimensions, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../styles/Colors';

const { width, height } = Dimensions.get('window');
interface Style {
  backgroundImage: ViewStyle;
  header: TextStyle;
  flexLeft: ViewStyle;
  divider: ViewStyle;
  infoBox: TextStyle;
  colorBox: ViewStyle;
  wrapper: ViewStyle;
  textWrapper: ViewStyle;
  iconWrapper: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: ThemeColors.blue_dark,
  },
  header: {
    color: ThemeColors.white,
    fontSize: 29,
    paddingBottom: 20,
    fontFamily: 'RobotoCondensed-Regular',
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
    width: width * 0.6,
    paddingVertical: 20,
  },
  colorBox: {
    justifyContent: 'center',
    flex: 0.2,
    paddingVertical: 15,
    paddingRight: 5,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  textWrapper: {
    flex: 0.8,
    paddingLeft: 10,
  },
  iconWrapper: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    paddingVertical: height * 0.03,
    paddingRight: width * 0.02,
    alignItems: 'center',
  },
});

export default styles;
