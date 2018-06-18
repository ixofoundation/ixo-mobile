import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

interface Style {
  wrapper: ViewStyle,
  slide: ViewStyle,
  logo: ViewStyle,
  buttons: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    flex: 1
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
});

export default styles;