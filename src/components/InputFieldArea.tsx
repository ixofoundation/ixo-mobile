import * as React from 'react';
import { TextStyle, StyleSheet, Dimensions } from 'react-native';
import { Textarea } from 'native-base';

const { height } = Dimensions.get('window');

const InputFieldArea = ({ value = '', onChangeText }: { onChangeText: any; value: string }) => (
	<Textarea style={styles.textArea} value={value} onChangeText={onChangeText} rowSpan={5} />
);

interface Style {
	textArea: TextStyle;
}

const styles = StyleSheet.create<Style>({
	textArea: {
		height: 'auto',
		minHeight: height * 0.07,
		maxHeight: height * 0.2,
		fontSize: height * 0.025
	}
});

export default InputFieldArea;
