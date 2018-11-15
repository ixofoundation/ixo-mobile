import * as React from 'react';
import Video from 'react-native-video';
import { StackActions, NavigationActions } from 'react-navigation';
import { View, StatusBar, Image, AsyncStorage, Platform } from 'react-native';
import { Text } from 'native-base';
import Swiper from 'react-native-swiper';
import Permissions from 'react-native-permissions';
import Loading from '../screens/Loading';
import OnBoardingStyles from '../styles/OnBoarding';
import { ThemeColors } from '../styles/Colors';
import { LocalStorageKeys } from '../models/phoneStorage';
import ConnectIXO from '../screens/ConnectIXO';

const logo = require('../../assets/logo.png');
const makeAnImpact = require('../../assets/ixoOnboarding1.mp4');
const noConnection = require('../../assets/ixoOnboarding2.mp4');

declare var swiperRef: any;
interface ParentProps {
	navigation: any;
	screenProps: any;
}

export default class OnBoarding extends React.Component<ParentProps> {
	state = {
		showOnboarding: false,
		swiperIndex: 0,
		pauseVideo: true
	};

	componentDidMount() {
		if (__DEV__) {
			// AsyncStorage.clear();
		}
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

	async getNotifications() {
		if (Platform.OS === 'ios') {
			Permissions.request('notification').then(response => {
				swiperRef.scrollBy(1);
			});
		} else {
			swiperRef.scrollBy(1);
			// TODO once push notification's are added
		}
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

	renderStepOne() {
		return (
			<View style={OnBoardingStyles.onboardingContainer}>
				<View style={OnBoardingStyles.logoContainer}>
					<Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
				</View>
				<Video resizeMode={'contain'} source={makeAnImpact} muted={true} playWhenInactive={false} playInBackground={true} style={OnBoardingStyles.videoStyle} />
				<View>
					<View>
						<Text style={OnBoardingStyles.onboardingHeading}>{this.props.screenProps.t('onboarding:makeImpact')}</Text>
					</View>
					<View>
						<Text style={OnBoardingStyles.onboardingParagraph}>{this.props.screenProps.t('onboarding:submitClaim')}</Text>
					</View>
				</View>
			</View>
		);
	}

	renderStepTwo() {
		return (
			<View style={OnBoardingStyles.onboardingContainer}>
				<View style={OnBoardingStyles.logoContainer}>
					<Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
				</View>
				<Video resizeMode={'contain'} source={noConnection} muted={true} playWhenInactive={false} playInBackground={false} style={OnBoardingStyles.videoStyle} />
				<View>
					<View>
						<Text style={OnBoardingStyles.onboardingHeading}>{this.props.screenProps.t('onboarding:noConnection')}</Text>
					</View>
					<View>
						<Text style={OnBoardingStyles.onboardingParagraph}>{this.props.screenProps.t('onboarding:saveClaim')}</Text>
					</View>
				</View>
			</View>
		);
	}

	renderSwiperSteps() {
		switch (this.state.swiperIndex) {
			case 0:
				return [this.renderStepOne(), <View key={1} />, <View key={2} />].map((element: JSX.Element) => {
					return element;
				});
			case 1:
				return [<View key={0} />, this.renderStepTwo(), <View key={2} />].map((element: JSX.Element) => {
					return element;
				});
			case 2:
				return [<View key={0} />, <View key={1} />, <ConnectIXO key={2} navigation={this.props.navigation} screenProps={this.props.screenProps} />].map(
					(element: JSX.Element) => {
						return element;
					}
				);
			default:
				return null;
		}
	}

	render() {
		if (this.state.showOnboarding) {
			return (
				<View style={OnBoardingStyles.wrapper}>
					<StatusBar barStyle="light-content" />
					<Swiper
						loop={false}
						ref={swiper => (swiperRef = swiper)}
						onIndexChanged={(index: number) => this.setState({ swiperIndex: index })}
						scrollEnabled={true}
						activeDotColor={ThemeColors.blue_medium}
						dotColor={ThemeColors.blue_light}
						showsButtons={false}
						// @ts-ignore
						activeDotStyle={OnBoardingStyles.dotStyle}
						// @ts-ignore
						dotStyle={OnBoardingStyles.dotStyle}
					>
						{this.renderSwiperSteps()}
					</Swiper>
				</View>
			);
		}
		return <Loading />;
	}
}
