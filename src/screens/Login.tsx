import { Fingerprint, SecureStore } from 'expo';
import { Input, Item, Label, Spinner, Text } from 'native-base';
import React from 'react';
import { Alert, AsyncStorage, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import IconEyeOff from '../../assets/svg/IconEyeOff';
import DarkButton from '../components/DarkButton';
import { showToastMessage, ToastPosition, ToastType } from '../lib/util/toast';
import { SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IUser } from '../models/user';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser } from '../redux/user/user_action_creators';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import LoginStyles from '../styles/Login';

const { width } = Dimensions.get('window');
const logo = require('../../assets/logo.png');
const background = require('../../assets/backgrounds/background_1.png');
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
		this.checkDeviceForHardware();
		this.checkForFingerprints();
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

			this.setState({ userName: name });

			if (name && did && verifyKey) {
				this.props.onUserInit({
					name: name,
					did: did,
					verifyKey: verifyKey
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	async checkDeviceForHardware() {
		let compatible = await Fingerprint.hasHardwareAsync();
		this.setState({ compatible }); // add these to states when logic is added
	}

	async checkForFingerprints() {
		let fingerprints = await Fingerprint.isEnrolledAsync();
		this.setState({ fingerprints }); // add these to states when logic is added
	}

	async scanFingerprint() {
		let result = await Fingerprint.authenticateAsync('Authenticate to sign in');
		if (result.success) {
			const resetAction = StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Projects' })]
			});
			this.props.navigation.dispatch(resetAction);
		}
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

	signIn() {
		this.setState({ loading: true });
		SecureStore.getItemAsync(SecureStorageKeys.password)
			.then(password => {
				// get phone password from secure store
				if (password === this.state.password) {
					this.props.navigation.dispatch(
						StackActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Projects' })]
						})
					);
				} else {
					showToastMessage(this.props.screenProps.t('login:wrongPassword'), ToastType.WARNING, ToastPosition.TOP);
					this.setState({ loading: false });
				}
			})
			.catch(() => {
				showToastMessage(this.props.screenProps.t('login:loginFailed'), ToastType.WARNING, ToastPosition.TOP);
				this.setState({ loading: false });
			});
	}

	render() {
		return (
			<ImageBackground source={background} style={[LoginStyles.wrapper]}>
				<View style={[ContainerStyles.flexColumn]}>
					<StatusBar barStyle="light-content" />
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

						<View style={[ContainerStyles.flexRow, { width: width * 0.8, flex: 0.2, paddingBottom: 20 }]}>
							<Item
								style={{ flex: 1, borderColor: ThemeColors.blue_lightest }}
								stackedLabel={!this.state.revealPassword}
								floatingLabel={this.state.revealPassword}
							>
								<Label style={{ color: ThemeColors.blue_lightest }}>{this.props.screenProps.t('login:password')}</Label>
								<Input
									style={{ color: ThemeColors.white }}
									value={this.state.password}
									onChangeText={password => this.setState({ password })}
									secureTextEntry={this.state.revealPassword}
								/>
							</Item>
							<TouchableOpacity onPress={() => this.revealPassword()}>
								<View style={{ position: 'absolute' }}>
									<IconEyeOff width={width * 0.06} height={width * 0.06} />
								</View>
							</TouchableOpacity>
						</View>
						{this.state.loading ? (
							<Spinner color={ThemeColors.blue_medium} />
						) : (
							<DarkButton text={this.props.screenProps.t('login:signIn')} onPress={() => this.signIn()} />
						)}
						<View style={[ContainerStyles.flexRow, { flex: 0.2 }]}>
							<Text style={LoginStyles.forgotPassword}>{this.props.screenProps.t('login:forgotPassword')}</Text>
						</View>
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
