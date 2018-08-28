import { StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { ThemeColors } from './Colors';

const { height, width } = Dimensions.get('window');

interface Style {
  wrapper: ViewStyle,
  slide: ViewStyle,
  logo: ViewStyle,
  buttons: ViewStyle,
  infoBlock: ViewStyle,
  infoBlockImage: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    flex: 1,
    backgroundColor: ThemeColors.blue_dark
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
  infoBlock: {
    borderWidth: 1,
    borderColor: ThemeColors.blue_light,
    justifyContent: 'center',
    height: height * 0.1,
  },
  infoBlockImage: {
    width: width * 0.08,
    height: width * 0.08
  }
});

export default styles;