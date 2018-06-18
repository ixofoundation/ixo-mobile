import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

import Colors from '../styles/Colors';

interface Style {
  headerSync: ViewStyle,
  projectBox: ViewStyle,
  projectBoxStatusBar: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  headerSync: {
    paddingLeft: 10,
    backgroundColor: Colors.grey_sync,
    height: 30,
    borderRadius: 30,
    marginRight: 10
  },
  projectBox: {
    margin: 10,
    borderColor: Colors.grey,
    borderWidth: 1,
  },
  projectBoxStatusBar: {
    height: '100%',
    width: 5,
  },
});

export default styles;