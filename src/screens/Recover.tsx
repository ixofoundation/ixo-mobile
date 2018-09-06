import { SecureStore } from 'expo';
import { Container, Icon, Text, Textarea, View, Toast } from 'native-base';
import React from 'react';
import { AsyncStorage, Dimensions, ImageBackground, StatusBar, KeyboardAvoidingView } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import _ from 'underscore';
import { env } from '../../config';
import DarkButton from '../components/DarkButton';
import { LocalStorageKeys, SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IUser } from '../models/user';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser } from '../redux/user/user_action_creators';
import { Encrypt, generateSovrinDID } from '../utils/sovrin';
import { showToast, toastType } from '../helpers/toasts';
import InputField from '../components/InputField';
import { ThemeColors } from '../styles/Colors';
import RecoverStyles from '../styles/Recover';

const background = require('../../assets/backgrounds/background_1.png');

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface IMnemonic {
	key: number;
	word: string;
}

export interface DispatchProps {
	onUserInit: (user: IUser) => void;
	onIxoInit: () => void;
}

export interface StateProps {
	ixo?: any;
}

interface StateTypes {
	username: string;
	password: string;
	confirmPassword: string;
	mnemonic: string;
	errorMismatch: boolean;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}

class Recover extends React.Component<Props, StateTypes> {
	componentDidMount() {
		this.props.onIxoInit();
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerLeft: <Icon name="arrow-back" onPress={() => navigation.pop()} style={{ paddingLeft: 10, color: ThemeColors.white }} />,
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	};

	state = {
		username: '',
		password: '',
		confirmPassword: '',
		mnemonic: '',
		errorMismatch: false
	};

	isAlreadyLedgered(did: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.props.ixo.user.getDidDoc(did).then((response: any) => {
				debugger;
				const { error = false } = response;
				if (error) {
					return reject('recover:userNotFound');
				}
				return resolve(true);
			});
		});
	}

	async handleConfirmMnemonic() {
		try {
			if (this.state.confirmPassword === '' || this.state.password === '' || this.state.username === '') throw 'register:missingFields';
			if (this.state.password !== this.state.confirmPassword) throw 'register:missmatchPassword';
			if (this.state.mnemonic === '') throw 'recover:secretPhrase';

			const sovrin = generateSovrinDID(this.state.mnemonic);
			const ledgered = await this.isAlreadyLedgered('did:sov:' + sovrin.did);
			if (ledgered) {
				const encryptedMnemonic = Encrypt(JSON.stringify({ mnemonic: this.state.mnemonic, name: this.state.username }), this.state.password); // encrypt securely on phone enlave
				SecureStore.setItemAsync(SecureStorageKeys.encryptedMnemonic, encryptedMnemonic.toString());
				SecureStore.setItemAsync(SecureStorageKeys.password, this.state.password); // save local password
				AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true'); // stop first time onboarding
				let user: IUser = {
					did: 'did:sov:' + sovrin.did,
					name: this.state.username,
					verifyKey: sovrin.verifyKey
				};
				AsyncStorage.setItem(UserStorageKeys.name, user.name);
				AsyncStorage.setItem(UserStorageKeys.did, user.did);
				AsyncStorage.setItem(UserStorageKeys.verifyKey, user.verifyKey);
				this.props.onUserInit(user);
				this.navigateToLogin();
			}
		} catch (exception) {
			showToast(this.props.screenProps.t(exception), toastType.WARNING);
		}
	}

	navigateToLogin() {
		this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Login' })]
			})
		);
	}

	render() {
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<ImageBackground source={background} style={[RecoverStyles.wrapper]}>
					<KeyboardAvoidingView behavior={'position'} enabled={true} contentContainerStyle={[RecoverStyles.keyboardContainer]}>
						<View style={{ height: Dimensions.get('window').height * 0.1 }} />
						<View>
							<View style={[RecoverStyles.flexLeft]}>
								<Text style={[RecoverStyles.header]}>{this.props.screenProps.t('recover:secretPhrase')}</Text>
							</View>
							<View style={{ width: '100%' }}>
								<View style={RecoverStyles.divider} />
							</View>

							<Text style={RecoverStyles.paragraph}>{this.props.screenProps.t('recover:secretParagraph_1')}</Text>
							<Text style={RecoverStyles.paragraph}>
								<Text style={[RecoverStyles.paragraph, { color: ThemeColors.orange }]}>{this.props.screenProps.t('register:warning')}:</Text>
								{this.props.screenProps.t('register:secretParagraph_2')}
							</Text>
							<InputField
								value={this.state.mnemonic}
								labelName={this.props.screenProps.t('recover:mnemonic')}
								onChangeText={(text: string) => this.setState({ mnemonic: text })}
							/>
							<InputField
								value={this.state.username}
								labelName={this.props.screenProps.t('register:yourName')}
								onChangeText={(text: string) => this.setState({ username: text })}
							/>
							<InputField
								password={true}
								value={this.state.password}
								labelName={this.props.screenProps.t('register:newPassword')}
								onChangeText={(text: string) => this.setState({ password: text })}
							/>
							<InputField
								password={true}
								value={this.state.confirmPassword}
								labelName={this.props.screenProps.t('register:confirmPassword')}
								onChangeText={(text: string) => this.setState({ confirmPassword: text })}
							/>
							<DarkButton onPress={() => this.handleConfirmMnemonic()} propStyles={{ marginTop: 15 }} text={this.props.screenProps.t('recover:next')} />
						</View>
					</KeyboardAvoidingView>
				</ImageBackground>
			</Container>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onIxoInit: () => {
			dispatch(initIxo(env.REACT_APP_BLOCKCHAIN_IP, env.REACT_APP_BLOCK_SYNC_URL));
		},
		onUserInit: (user: IUser) => {
			dispatch(initUser(user));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Recover);
