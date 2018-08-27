import React from 'react';
import { StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Icon, Content, Text } from 'native-base';

import { ThemeColors } from '../styles/Colors';
import ContainersStyles from '../styles/Containers';

const height = Dimensions.get('window').height;

const SettingsLink = ({ name, route, navigation }: { name: string; route: string; navigation: any }) => (
	<TouchableOpacity style={[ContainersStyles.flexRow, { justifyContent: 'space-between' }]} onPress={() => navigation.navigate(route)}>
		<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 19, fontWeight: '500', paddingHorizontal: 5, paddingVertical: 10 }}>
			{name}
		</Text>
		<Icon name="arrow-forward" onPress={() => navigation.pop()} style={{ paddingLeft: 10, color: ThemeColors.grey }} />
	</TouchableOpacity>
);

const LogoutLink = () => (
	<TouchableOpacity>
		<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500', paddingHorizontal: 5, paddingTop: 80 }}>
			Log out
		</Text>
	</TouchableOpacity>
);

interface ParentProps {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

class Settings extends React.Component<ParentProps> {
	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="close" onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />,
			title: 'Settings',
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
		};
	};

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.white }}>
				<StatusBar barStyle="dark-content" />
				<Content contentContainerStyle={{ backgroundColor: ThemeColors.white, padding: 20 }}>
					<SettingsLink route={'Notifications'} name={'Notifications'} navigation={this.props.navigation} />
					<SettingsLink route={'Privacy'} name={'Privacy'} navigation={this.props.navigation} />
					<LogoutLink />
				</Content>
			</Container>
		);
	}
}

export default Settings;
