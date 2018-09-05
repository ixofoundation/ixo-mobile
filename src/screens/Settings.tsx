import { Container, Content, Icon, Text } from 'native-base';
import React from 'react';
import { Dimensions, StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import { ThemeColors } from '../styles/Colors';
import ContainersStyles from '../styles/Containers';
import DarkButton from '../components/DarkButton';
import { StackActions, NavigationActions } from 'react-navigation';

const SettingsLink = ({ name, route, navigation }: { name: string; route: string; navigation: any }) => (
	<TouchableOpacity style={[ContainersStyles.flexRow, { justifyContent: 'space-between' }]} onPress={() => navigation.navigate(route)}>
		<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 19, fontWeight: '500', paddingHorizontal: 5, paddingVertical: 10 }}>{name}</Text>
		<Icon name="arrow-forward" onPress={() => navigation.pop()} style={{ paddingLeft: 10, color: ThemeColors.grey }} />
	</TouchableOpacity>
);

const LogoutLink = () => (
	<TouchableOpacity>
		<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500', paddingHorizontal: 5, paddingTop: 80 }}>Log out</Text>
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
			headerLeft: <Icon name="close" onPress={() => props.navigation.navigate('Drawer')} style={{ paddingLeft: 10 }} />,
			title: 'Settings',
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
		};
	};

	resetAccount() {
		AsyncStorage.clear();
		this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'OnBoarding' })]
			})
		);
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.white }}>
				<StatusBar barStyle="dark-content" />
				<Content contentContainerStyle={{ backgroundColor: ThemeColors.white, padding: 20 }}>
					<DarkButton text="Reset Account" onPress={() => this.resetAccount()} />
				</Content>
			</Container>
		);
	}
}

export default Settings;
