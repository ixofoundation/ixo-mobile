import { StyleSheet, ViewStyle, Dimensions, Platform } from 'react-native';

import { ThemeColors } from '../styles/Colors';
const { height } = Dimensions.get('window');

interface Style {
  ClaimBox: ViewStyle,
  DeleteButton: ViewStyle,
  DeleteButtonText: ViewStyle,
  SubmitButton: ViewStyle,
  BadgeBoxContainer: ViewStyle,
  BoxContainer: ViewStyle,
  Badge: ViewStyle,
}

const styles = StyleSheet.create<Style>({
  DeleteButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: ThemeColors.grey,
    borderLeftWidth: 0,
  },
  DeleteButtonText: {
    color: ThemeColors.white,
    fontSize:(Platform.OS === 'ios') ? 13 : 10,
    fontWeight: "700"
  },
  ClaimBox: {
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingBottom: 15,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: ThemeColors.grey,
    marginTop: 10
  },
  SubmitButton: {
    borderTopWidth: 1,
    borderColor: ThemeColors.grey,
    height: height * 0.1,
    backgroundColor: ThemeColors.white
  },
  BadgeBoxContainer: { 
    borderWidth: 1,
    borderColor: ThemeColors.grey_sync,
    borderRadius: 20,
    justifyContent: 'flex-start',
    backgroundColor: ThemeColors.grey_sync,
    marginLeft: 10,
    marginRight: 10
  },
  Badge: {
    backgroundColor: ThemeColors.white,
    borderRadius: 30,
    flex: 0.32
  },
  BoxContainer: {
    borderWidth: 1,
    borderColor: ThemeColors.black,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10
  }
});

export default styles;