import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

interface Style {
  modalOuterContainer: ViewStyle;
  modalInnerContainer: ViewStyle;
  flexRight: ViewStyle;
  flexLeft: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  modalOuterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.2,
    backgroundColor: 'white',
    marginHorizontal: width * 0.05
  },
  modalInnerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: width * 0.8,
    height: height * 0.6 
  },
  flexRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  flexLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }
});

export default styles;