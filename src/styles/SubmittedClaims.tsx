import { StyleSheet, ViewStyle, Dimensions, Platform } from 'react-native';

import Colors from '../styles/Colors';
const { height } = Dimensions.get('window');

interface Style {
  SubmitButton: ViewStyle,
  BadgeBoxContainer: ViewStyle,
  BoxContainer: ViewStyle,
  Badge: ViewStyle,
  ProjectBox: ViewStyle,
  ProjectBoxStatusBar: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  SubmitButton: {
    borderTopWidth: 1,
    borderColor: Colors.grey,
    height: height * 0.1,
    backgroundColor: Colors.white
  },
  BadgeBoxContainer: { 
    borderWidth: 1,
    borderColor: Colors.grey_sync,
    borderRadius: 20,
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
    marginLeft: 10,
    marginRight: 10
  },
  Badge: {
    backgroundColor: Colors.grey_sync,
    borderRadius: 30,
    flex: 0.32
  },
  BoxContainer: {
    borderWidth: 1,
    backgroundColor: Colors.grey_sync,
    borderColor: Colors.grey_sync,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10
  },
  ProjectBox: {
    margin: 5,
    borderColor: Colors.grey,
    borderWidth: 1,
  },
  ProjectBoxStatusBar: {
    height: '100%',
    width: 7,
  },
});

export default styles;