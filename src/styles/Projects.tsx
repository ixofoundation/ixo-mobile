import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

import { ThemeColors } from '../styles/Colors';

interface Style {
  headerSync: ViewStyle,
  projectBox: ViewStyle,
  projectBoxStatusBar: ViewStyle,
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
    borderColor: ThemeColors.grey,
    borderWidth: 1,
  },
  projectBoxStatusBar: {
    height: '100%',
    width: 5,
  },
});

export default styles;