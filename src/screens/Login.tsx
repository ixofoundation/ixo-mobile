import { Toast, Text } from 'native-base';
import SInfo from 'react-native-sensitive-info';
import * as React from 'react';
import {
	AsyncStorage,
	Dimensions,
	Image,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	StatusBar,
	TouchableOpacity,
	View,
	Alert,
	ActivityIndicator
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import IconEyeOff from '../components/svg/IconEyeOff';
import DarkButton from '../components/DarkButton';
import { SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IUser } from '../models/user';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser } from '../redux/user/user_action_creators';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import LoginStyles from '../styles/Login';
import InputField from '../components/InputField';

const { width } = Dimensions.get('window');
const logo = require('../../assets/logo.png');
const background = require('../../assets/background_1.png');
const IconFingerprint = require('../../assets/iconFingerprint.png');

const LogoView = () => (
	<View style={ContainerStyles.flexColumn}>
		<View style={ContainerStyles.flexRow}>
			<Image resizeMode={'contain'} style={LoginStyles.logo} source={logo} />
		</View>
	</View>
);

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
}
export interface DispatchProps {
	onUserInit: (user: IUser) => void;
}

export interface StateProps {
	user?: IUser;
}

export interface Props extends ParentProps, StateProps, DispatchProps {}

export class Login extends React.Component<Props, StateTypes> {
	state = {
		password: '',
		revealPassword: true,
		compatible: false,
		fingerprints: false,
		loading: false,
		userName: ''
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

	render() {
		return (
			<ImageBackground source={background} style={[LoginStyles.wrapper]}>
				<View style={[ContainerStyles.flexColumn]}>
					<StatusBar backgroundColor={ThemeColors.blue_dark} barStyle='light-content' />
					<KeyboardAvoidingView behavior={'position'}>
						<LogoView />
						<View style={[LoginStyles.flexLeft]}>
							<Text style={LoginStyles.header}>
								{this.props.screenProps.t('login:hi')} {this.state.userName}
							</Text>
						</View>
						<View style={{ width: '100%' }}>
							<View style={LoginStyles.divider} />
						</View>
						<View style={LoginStyles.flexLeft}>
							<Text style={LoginStyles.infoBox}>{this.props.screenProps.t('login:attention')} </Text>
						</View>
						<InputField
							icon={<TouchableOpacity style={{ position: 'relative', top: 10 }} onPress={() => this.revealPassword()}><IconEyeOff width={width * 0.06} height={width * 0.06} /></TouchableOpacity>}
							labelName={this.props.screenProps.t('login:password')}
							onChangeText={(password: string) => this.setState({ password })}
							password={this.state.revealPassword}
						/>
						{this.state.loading ? (
							<ActivityIndicator color={ThemeColors.blue_medium} />
						) : (
							<DarkButton text={this.props.screenProps.t('login:signIn')} onPress={() => this.signIn()} />
						)}
						<TouchableOpacity
							style={[ContainerStyles.flexRow, { flex: 0.2, paddingBottom: 20 }]}
							onPress={() => (Platform.OS === 'android' ? this.showAndroidAlert() : this.scanFingerprint())}
						>
							<Image resizeMode={'contain'} style={LoginStyles.fingerImage} source={IconFingerprint} />
						</TouchableOpacity>
					</KeyboardAvoidingView>
				</View>
			</ImageBackground>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onUserInit: (user: IUser) => {
			dispatch(initUser(user));
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		user: state.userStore.user
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login);
