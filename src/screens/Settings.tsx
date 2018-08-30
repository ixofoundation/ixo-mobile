import React from 'react';
import { StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Icon, Content, Text } from 'native-base';

import { ThemeColors } from '../styles/Colors';
import ContainersStyles from '../styles/Containers';

interface PropTypes {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

class Settings extends React.Component<PropTypes> {
	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="close" onPress={() => props.navigation.navigate('Drawer')} style={{ paddingLeft: 10 }} />,
			title: 'Settings',
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

export default Settings;
