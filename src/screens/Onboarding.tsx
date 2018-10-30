import * as React from 'react';
import Video from 'react-native-video';
import { StackActions, NavigationActions } from 'react-navigation';
import { View, StatusBar, Image, AsyncStorage, Platform, Dimensions } from 'react-native';
import { Text, Button } from 'native-base';
import Swiper from 'react-native-swiper';
import Permissions from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '../screens/Loading';
import OnBoardingStyles from '../styles/OnBoarding';
import ContainerStyles from '../styles/Containers';
import { ThemeColors, OnboardingBox } from '../styles/Colors';
import { LocalStorageKeys } from '../models/phoneStorage';
import ConnectIXO from '../screens/ConnectIXO';

const logo = require('../../assets/logo.png');
const makeAnImpact = require('../../assets/ixoOnboarding1.mp4');
const noConnection = require('../../assets/ixoOnboarding2.mp4');

const { width } = Dimensions.get('window');
declare var swiperRef: any;

const LogoView = () => (
	<View style={ContainerStyles.flexRow}>
		<Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
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
		AsyncStorage.clear();
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

	render() {
		if (this.state.showOnboarding) {
			return (
				<View
				// 	start={{ x: 0, y: 0.2 }}
					// end={{ x: 0.4, y: 0.3 }}
					style={OnBoardingStyles.wrapper}
					// colors={[OnboardingBox.colorSecondary, OnboardingBox.colorPrimary]}
				>
					<StatusBar barStyle='light-content' />
					<Swiper
						ref={swiper => (swiperRef = swiper)}
						scrollEnabled={true}
						activeDotColor={ThemeColors.blue_medium}
						dotColor={ThemeColors.blue_light}
						showsButtons={false}
						activeDotStyle={OnBoardingStyles.dotStyle}
						dotStyle={OnBoardingStyles.dotStyle}
					>
						<View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
							<View
								style={[
									{
										alignItems: 'center',
										justifyContent: 'center',
										flexDirection: 'row'
									}
								]}
							>
								<Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
							</View>
							<Video
								repeat
								source={makeAnImpact} // Can be a URL or a local file.
								ref={ref => {
									this.player = ref;
								}} // Store reference
								// onBuffer={this.onBuffer} // Callback when remote video is buffering
								// onError={this.videoError} // Callback when video cannot be loaded
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									flex: 0.5
								}}
							/>
							<View>
								<View>
									<Text style={{ textAlign: 'center', color: ThemeColors.blue_lightest, paddingBottom: 10, fontSize: 28 }}>Make Your Impact</Text>
								</View>
								<View>
									<Text style={{ textAlign: 'center', color: ThemeColors.white, paddingBottom: 10, fontSize: 18 }}>Submit claims of what you have done</Text>
								</View>
							</View>
						</View>
						<View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
							<View
								style={[
									{
										alignItems: 'center',
										justifyContent: 'center',
										flexDirection: 'row'
									}
								]}
							>
								<Image resizeMode={'contain'} style={OnBoardingStyles.logo} source={logo} />
							</View>
							<Video
								repeat
								source={noConnection} // Can be a URL or a local file.
								ref={ref => {
									this.player = ref;
								}} // Store reference
								// onBuffer={this.onBuffer} // Callback when remote video is buffering
								// onError={this.videoError} // Callback when video cannot be loaded
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									flex: 0.5
								}}
							/>
							<View>
								<View>
									<Text style={{ textAlign: 'center', color: ThemeColors.blue_lightest, paddingBottom: 10, fontSize: 28 }}>No connection?</Text>
								</View>
								<View>
									<Text style={{ textAlign: 'center', color: ThemeColors.white, paddingBottom: 10, fontSize: 18 }}>Save your claims and submit them later</Text>
								</View>
							</View>
						</View>
						<ConnectIXO navigation={this.props.navigation} screenProps={this.props.screenProps} />
					</Swiper>
				</View>
			);
		}
		return <Loading />;
	}
}
