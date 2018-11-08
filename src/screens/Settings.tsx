import { Container, Content, Icon } from 'native-base';
import * as React from 'react';
import { StatusBar, AsyncStorage } from 'react-native';
import { ThemeColors } from '../styles/Colors';
import DarkButton from '../components/DarkButton';
import { StackActions, NavigationActions } from 'react-navigation';
import { purgeStore } from '../redux/store';

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
		purgeStore();
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'OnBoarding' })]
		});
		this.props.navigation.dispatch(resetAction);
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
