import { Toast, Text } from 'native-base';
import SInfo from 'react-native-sensitive-info';
import * as React from 'react';
import { AsyncStorage, Image, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import DarkButton from '../components/DarkButton';
import { SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IUser } from '../models/user';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser, userSetPassword } from '../redux/user/user_action_creators';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import LoginStyles from '../styles/Login';
import InputField from '../components/InputField';
import Video from 'react-native-video';
import CustomIcon from '../components/svg/CustomIcons';
import { showToast, toastType } from '../utils/toasts';

const logo = require('../../assets/logo.png');
const globe = require('../../assets/globe.mp4');
const IconFingerprint = require('../../assets/iconFingerprint.png');

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface StateTypes {
	revealPassword: boolean;
	compatible: boolean;
	fingerprints: boolean;
	password: string;
	loading: boolean;
	userName: string;
	existingUser: boolean;
}

export interface DispatchProps {
	onUserInit: (user: IUser) => void;
	onUserPasswordSet: () => void;
}

export interface StateProps {
	user?: IUser;
	isPasswordSet: boolean;
}

export interface Props extends ParentProps, StateProps, DispatchProps {}

export class Login extends React.Component<Props, StateTypes> {
	state = {
		password: '',
		revealPassword: true,
		compatible: false,
		fingerprints: false,
		loading: false,
		userName: '',
		existingUser: false
	};

	componentDidMount() {
		if (this.props.user === null) {
			this.retrieveUserFromStorage();
		} else {
			this.setState({ userName: this.props.user!.name });
		}
	}

	async retrieveUserFromStorage() {
		try {
			const name = await AsyncStorage.getItem(UserStorageKeys.name);
			const did = await AsyncStorage.getItem(UserStorageKeys.did);
			const verifyKey = await AsyncStorage.getItem(UserStorageKeys.verifyKey);

			// this.setState({ userName: name });

			if (name && did && verifyKey) {
				this.props.onUserInit({
					name,
					did,
					verifyKey
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	async scanFingerprint() {
		// let result = await Fingerprint.authenticateAsync('Authenticate to sign in');
		// if (result.success) {
		// 	const resetAction = StackActions.reset({
		// 		index: 0,
		// 		actions: [NavigationActions.navigate({ routeName: 'Projects' })]
		// 	});
		// 	this.props.navigation.dispatch(resetAction);
		// }
	}

	showAndroidAlert() {
		Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor and press scan.', [
			{
				text: 'Scan',
				onPress: () => {
					this.scanFingerprint();
				}
			},
			{ text: 'Cancel', onPress: () => console.log('Cancel'), style: 'cancel' }
		]);
	}

	revealPassword = () => {
		this.setState({ revealPassword: !this.state.revealPassword });
	};

	forgotPassword = () => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'ConnectIXO' })]
		});

		Alert.alert(
			`${this.props.screenProps.t('login:resetPassword')}`,
			`${this.props.screenProps.t('login:requiredToReset')}`,
			[
				{ text: 'Continue', onPress: () => this.props.navigation.dispatch(resetAction) },
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
			],
			{ cancelable: false }
		);
	};

	signIn() {
		this.setState({ loading: true });
		// @ts-ignore
		SInfo.getItem(SecureStorageKeys.password, {})
			.then((password: string) => {
				// get phone password from secure store
				if (password === this.state.password) {
					this.props.navigation.dispatch(
						StackActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Projects' })]
						})
					);
				} else {
					Toast.show({
						text: this.props.screenProps.t('login:wrongPassword'),
						buttonText: 'OK',
						type: 'warning',
						position: 'top'
					});
					this.setState({ loading: false });
				}
			})
			.catch(() => {
				Toast.show({
					text: this.props.screenProps.t('login:loginFailed'),
					buttonText: 'OK',
					type: 'warning',
					position: 'top'
				});
				this.setState({ loading: false });
			});
	}

	setPassword() {
		if (this.state.password.length < 8) {
			showToast(this.props.screenProps.t('register:passwordShort'), toastType.WARNING);
			return;
		}
		// @ts-ignore
		SInfo.setItem(SecureStorageKeys.password, this.state.password!, {});
		this.props.onUserPasswordSet();
		this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Projects' })]
			})
		);
	}

	renderExistingUser() {
		return (
			<KeyboardAvoidingView behavior={'position'} enabled={Platform.OS === 'ios'}>
				<View style={[ContainerStyles.flexRow, LoginStyles.logoContainer]}>
					<Image resizeMode={'contain'} style={LoginStyles.logo} source={logo} />
				</View>
				<InputField
					containerStyle={{ flex: 0.1, marginBottom: 30 }}
					prefixIcon={<CustomIcon name="lock" style={LoginStyles.inputIcons} />}
					suffixIcon={
						<TouchableOpacity onPress={() => this.revealPassword()}>
							<CustomIcon name="eyeoff" style={LoginStyles.inputIcons} />
						</TouchableOpacity>
					}
					underlinePositionRatio={0.03}
					labelName={this.props.screenProps.t('login:password')}
					onChangeText={(password: string) => this.setState({ password })}
					password={this.state.revealPassword}
				/>
				<View style={[{ flex: 0.2 }]}>
					{this.state.loading ? (
						<ActivityIndicator color={ThemeColors.blue_medium} />
					) : (
						<DarkButton text={this.props.screenProps.t('login:signIn')} onPress={() => this.signIn()} />
					)}
				</View>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Recover')}>
					<Text style={LoginStyles.recover}>{this.props.screenProps.t('login:recover')}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[ContainerStyles.flexRow, { flex: 0.1, marginVertical: 20 }]}
					onPress={() => (Platform.OS === 'android' ? this.showAndroidAlert() : this.scanFingerprint())}
				>
					<Image resizeMode={'contain'} style={LoginStyles.fingerImage} source={IconFingerprint} />
				</TouchableOpacity>
			</KeyboardAvoidingView>
		);
	}

	renderNewUser() {
		return (
			<KeyboardAvoidingView behavior={'position'} enabled={Platform.OS === 'ios'} style={{ flex: 1, justifyContent: 'flex-end' }}>
				<View style={[LoginStyles.flexLeft]}>
					<Text style={LoginStyles.header}>
						{this.props.screenProps.t('login:hi')} {this.state.userName}
					</Text>
				</View>
				<View style={{ width: '100%' }}>
					<View style={LoginStyles.divider} />
				</View>
				{
					!this.props.isPasswordSet &&
					<View style={LoginStyles.flexLeft}>
						<Text style={LoginStyles.infoBox}>{this.props.screenProps.t('login:attention')} </Text>
					</View>
				}
				<View style={LoginStyles.flexLeft}>
					<Text style={[LoginStyles.infoBoxLong]}>{this.props.screenProps.t('login:secure')} </Text>
				</View>
				<InputField
					containerStyle={{ flex: 0.3, marginBottom: 30 }}
					prefixIcon={<CustomIcon name="lock" style={LoginStyles.inputIcons} />}
					suffixIcon={<CustomIcon name="eyeoff" style={LoginStyles.inputIcons} />}
					onSuffixImagePress={this.revealPassword}
					underlinePositionRatio={0.03}
					labelName={this.props.screenProps.t('login:createPassword')}
					onChangeText={(password: string) => this.setState({ password })}
					password={this.state.revealPassword}
				/>

				{this.state.loading ? (
					<ActivityIndicator color={ThemeColors.blue_medium} />
				) : (
					<DarkButton text={this.props.screenProps.t('login:signIn')} onPress={() => this.setPassword()} />
				)}
			</KeyboardAvoidingView>
		);
	}

	render() {
		return (
			<View style={[LoginStyles.wrapper, { backgroundColor: '#0c2938' }]}>
				<Video source={globe} rate={1.0} volume={1.0} muted={false} resizeMode={'cover'} repeat style={LoginStyles.globeView} />
				<View style={[ContainerStyles.flexColumn]}>
					<StatusBar backgroundColor={ThemeColors.blue_dark} barStyle="light-content" />
					{this.props.isPasswordSet ? this.renderExistingUser() : this.renderNewUser()}
				</View>
			</View>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onUserInit: (user: IUser) => {
			dispatch(initUser(user));
		},
		onUserPasswordSet: () => {
			dispatch(userSetPassword());
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		user: state.userStore.user,
		isPasswordSet: state.userStore.isLoginPasswordSet
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
