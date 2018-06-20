import { StyleSheet, ViewStyle, Dimensions } from 'react-native';

import Colors from '../styles/Colors';

const { width } = Dimensions.get('window');

interface Style {
  wrapper: ViewStyle,
}

const styles = StyleSheet.create<Style>({
    wrapper: {
        flex: 1
    },
    photoBoxContainer: {
        width: width / 4,
        height: width / 4,
        borderWidth: 1,
        borderColor: Colors.grey,
        margin: 10,
        padding: 4
    },
    photoBoxCloseIcon: {
        color: Colors.grey,
        fontSize: 15
    },
    photoBoxCameraIcon: {
        color: Colors.grey,
        fontSize: 50
    },
    
});

export default styles;