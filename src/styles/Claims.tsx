import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

import Colors from '../styles/Colors';
const { height } = Dimensions.get('window');

interface Style {
  ClaimBox: ViewStyle,
  DeleteButton: ViewStyle,
  SubmitButton: ViewStyle,
  BadgeBoxContainer: ViewStyle,
  BoxContainer: ViewStyle,
  Badge: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  DeleteButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderLeftWidth: 0,
  },
  ClaimBox: {
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingBottom: 15,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: Colors.grey,
    marginTop: 10
  },
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
    backgroundColor: Colors.grey_sync,
    marginLeft: 10,
    marginRight: 10
  },
  Badge: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    flex: 0.32
  },
  BoxContainer: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10
  }
});

export default styles;