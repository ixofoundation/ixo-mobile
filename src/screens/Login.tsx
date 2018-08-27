import React from 'react';
import { Fingerprint, SecureStore } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import _ from 'underscore';
import {
	KeyboardAvoidingView,
	View,
	StatusBar,
	Image,
	Alert,
	TouchableOpacity,
	Platform,
	Dimensions,
	AsyncStorage,
	ImageBackground
} from 'react-native';
import { Text, Item, Label, Input, Toast, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import LoginStyles from '../styles/Login';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';
import { SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import DarkButton from '../components/DarkButton';
import IconEyeOff from '../../assets/svg/IconEyeOff';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IUser } from '../models/user';
import { initUser } from '../redux/user/user_action_creators';

const { width } = Dimensions.get('window');
const logo = require('../../assets/logo.png');
const background = require('../../assets/backgrounds/background_1.jpg');
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
				<StatusBar barStyle="light-content" />
					<KeyboardAvoidingView behavior={'position'}>
						<LogoView />
						<View style={[LoginStyles.flexLeft]}>
							<Text style={LoginStyles.header}>{this.props.screenProps.t('login:hi')} {this.state.userName}</Text>
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
