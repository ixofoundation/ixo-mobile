import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

import { ThemeColors } from '../styles/Colors';

const { width, height } = Dimensions.get('window');

interface Style {
  headerSync: ViewStyle,
  projectBox: ViewStyle,
  projectBoxStatusBar: ViewStyle,
  flexLeft: ViewStyle,
  header: TextStyle,
  textBoxLeft: ViewStyle,
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
    margin: 10,
  },
  projectBoxStatusBar: {
    height: '100%',
    width: 5,
  },
  flexLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%'
  },
  header: {
    color: ThemeColors.white,
    fontSize: 29,
    paddingBottom: 20,
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
});

export default styles;