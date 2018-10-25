import * as React from 'react';
import { ViewStyle, TextStyle, StyleSheet, Dimensions } from 'react-native';
import { Text, View } from 'native-base';

const { height } = Dimensions.get('window');

import { ThemeColors } from '../styles/Colors';

const Banner = ({
	text = '?'
}: {
	text: string;
}) => (
	<View style={styles.bannerContainer}>
		<Text style={styles.bannerText}>{text}</Text>
	</View>
);

interface Style {
	bannerContainer: ViewStyle;
	bannerText: TextStyle;
}

const styles = StyleSheet.create<Style>({
	bannerContainer: {
		height: height * 0.03,
		width: '100%',
		backgroundColor: ThemeColors.red,
		alignItems: 'center'
	},
	bannerText: {
		fontSize: height * 0.015,
		textAlign: 'center',
		color: ThemeColors.white,
		fontFamily: 'RobotoCondensed-Regular',
		paddingTop: 4
	}
});

export default Banner;
