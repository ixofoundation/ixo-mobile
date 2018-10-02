import { Container, Content, Icon, Text } from 'native-base';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { ThemeColors } from '../styles/Colors';

interface ParentProps {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

class Help extends React.Component<ParentProps> {
	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="close" onPress={() => props.navigation.navigate('Drawer')} style={{ paddingLeft: 10 }} />,
			title: 'Help',
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
		};
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.white }}>
				<StatusBar barStyle="dark-content" />
				<Content contentContainerStyle={{ backgroundColor: ThemeColors.white, padding: 20 }}>
					<Text>Content to be confirmed</Text>
				</Content>
			</Container>
		);
	}
}

export default Help;
