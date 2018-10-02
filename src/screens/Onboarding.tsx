import * as React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import { View, StatusBar, Image, AsyncStorage } from 'react-native';
import { Text, Button } from 'native-base';
import Swiper from 'react-native-swiper';
import Permissions from 'react-native-permissions';
import Loading from '../screens/Loading';
import OnBoardingStyles from '../styles/OnBoarding';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';
import { LocalStorageKeys } from '../models/phoneStorage';

const logo = require('../../assets/logo.png');
declare var swiperRef: any;

const LogoView = () => (
	<View style={ContainerStyles.flexColumn}>
		<View style={ContainerStyles.flexRow}>
			<Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
		</View>
	</View>
);

interface ParentProps {
	navigation: any;
	screenProps: any;
}

export default class OnBoarding extends React.Component<ParentProps> {
	state = {
		showOnboarding: false
	};

	componentDidMount() {
		// AsyncStorage.clear();
		AsyncStorage.getItem(LocalStorageKeys.firstLaunch, (error: any, firstLaunch: string | undefined) => {
			if (!firstLaunch || error) {
				this.setState({ showOnboarding: true });
			} else {
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Login' })]
				});
				this.props.navigation.dispatch(resetAction);
			}
		});
	}

	getNotifications() {
		Permissions.request('notification').then(response => {
			swiperRef.scrollBy(1);
		});
	}

	getLocation() {
		Permissions.request('location').then(response => {
				const resetAction = StackActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'ConnectIXO' })]
				});
				this.props.navigation.dispatch(resetAction);
		});
	}

	render() {
		if (this.state.showOnboarding) {
			return (
				<View style={OnBoardingStyles.wrapper}>
					<StatusBar barStyle="light-content" />
					<Swiper
						ref={swiper => (swiperRef = swiper)}
						scrollEnabled={false}
						activeDotColor={ThemeColors.white}
						dotColor={ThemeColors.blue_light}
						showsButtons={false}
					>
						<View style={[ContainerStyles.flexColumn, ContainerStyles.backgroundColorDark]}>
							<LogoView />
							<View>
								<Text style={{ textAlign: 'center', color: ThemeColors.white, paddingBottom: 10 }}>
									{this.props.screenProps.t('onboarding:appOnboarding')}
								</Text>
							</View>
							<View style={[ContainerStyles.flexRow]}>
								<Button style={OnBoardingStyles.buttons} onPress={() => swiperRef.scrollBy(1)} bordered light>
									<Text>{this.props.screenProps.t('onboarding:begin')}</Text>
								</Button>
							</View>
						</View>
						<View style={[OnBoardingStyles.slide, ContainerStyles.backgroundColorDark]}>
							<LogoView />
							<View style={OnBoardingStyles.textBoxButtonContainer}>
								<View style={OnBoardingStyles.textBox}>
									<Text style={{ textAlign: 'center', color: ThemeColors.white }}>{this.props.screenProps.t('onboarding:pushNotification')}</Text>
								</View>
								<View style={[ContainerStyles.flexRow]}>
									<Button style={OnBoardingStyles.buttons} onPress={() => this.getNotifications()} bordered light>
										<Text>{this.props.screenProps.t('onboarding:pushNotificationButton')}</Text>
									</Button>
								</View>
							</View>
						</View>
						<View style={[OnBoardingStyles.slide, ContainerStyles.backgroundColorDark]}>
							<LogoView />
							<View style={OnBoardingStyles.textBoxButtonContainer}>
								<View style={OnBoardingStyles.textBox}>
									<Text style={{ textAlign: 'center', color: ThemeColors.white }}>{this.props.screenProps.t('onboarding:locationLogging')}</Text>
								</View>
								<View style={[ContainerStyles.flexRow]}>
									<Button style={OnBoardingStyles.buttons} onPress={() => this.getLocation()} bordered light>
										<Text>{this.props.screenProps.t('onboarding:locationLoggingButton')}</Text>
									</Button>
								</View>
							</View>
						</View>
					</Swiper>
				</View>
			);
		}
		return <Loading />;
	}
}
