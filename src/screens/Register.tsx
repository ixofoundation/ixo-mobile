import LinearGradient from 'react-native-linear-gradient';
import { Container, Icon, Text, View } from 'native-base';
import React from 'react';
import { AsyncStorage, Dimensions, ImageBackground, KeyboardAvoidingView, StatusBar, TouchableOpacity } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import _ from 'underscore';
import { env } from '../config';
import DarkButton from '../components/DarkButton';
import InputField from '../components/InputField';
import LightButton from '../components/LightButton';
import { LocalStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IUser } from '../models/user';
import { SecureStorageKeys } from '../models/phoneStorage';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser } from '../redux/user/user_action_creators';
import { ButtonDark, ThemeColors } from '../styles/Colors';
import RegisterStyles from '../styles/Register';
import { Encrypt, generateSovrinDID, getSignature } from '../utils/sovrin';
import { showToast, toastType } from '../utils/toasts';

const bip39 = require('react-native-bip39');
const background = require('../../assets/background_1.png');

enum registerSteps {
	captureDetails = 1,
	revealMnemonic,
	reenterMnemonic
}

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
	registerState: registerSteps;
	mnemonic: string;
	selectedWords: IMnemonic[] | any[];
	unSelectedWords: IMnemonic[] | any[];
	errorMismatch: boolean;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}

class Register extends React.Component<Props, StateTypes> {
	componentDidMount() {
		this.props.onIxoInit();
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerLeft: <Icon name='arrow-back' onPress={() => navigation.pop()} style={{ paddingLeft: 10, color: ThemeColors.white }} />,
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
		registerState: registerSteps.captureDetails,
		mnemonic: '',
		selectedWords: [],
		unSelectedWords: [],
		errorMismatch: false
	};

	async generateMnemonic() {
		const mnemonic = await bip39.generateMnemonic();
		const mnemonicArray: IMnemonic[] = [];
		_.each(this.shuffleArray(mnemonic.split(' ')), (word, index) => {
			mnemonicArray.push({ key: index, word });
		});
		this.setState({ unSelectedWords: mnemonicArray, mnemonic });
	}

	shuffleArray(array: string[]) {
		// Durstenfeld shuffle algorithm
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
		}
		return array;
	}

	handleUnselectedToSelected(mnemonic: IMnemonic) {
		const selectedWords: IMnemonic[] = this.state.selectedWords;
		selectedWords.push(mnemonic);
		this.setState({
			unSelectedWords: this.state.unSelectedWords.filter((e: IMnemonic) => e.key !== mnemonic.key),
			selectedWords
		});
	}

	handleSelectedToUnselected(mnemonic: IMnemonic) {
		const unSelectedWords: IMnemonic[] = this.state.unSelectedWords;
		unSelectedWords.push(mnemonic);
		this.setState({
			selectedWords: this.state.selectedWords.filter((e: IMnemonic) => e.key !== mnemonic.key),
			unSelectedWords
		});
	}

	getMnemonicString(mnemonicArray: IMnemonic[]) {
		const mnemonicString: string[] = [];
		_.each(mnemonicArray, (mnemonic: IMnemonic) => {
			mnemonicString.push(mnemonic.word);
		});
		return mnemonicString.join(' ');
	}

	handleConfirmMnemonic() {
		if (this.getMnemonicString(this.state.selectedWords) !== this.state.mnemonic) {
			this.setState({ errorMismatch: true });
		} else {
			const encryptedMnemonic = Encrypt(JSON.stringify({ mnemonic: this.state.mnemonic, name: this.state.username }), this.state.password); // encrypt securely on phone enlave
			// @ts-ignore
			SInfo.setItem(SecureStorageKeys.encryptedMnemonic, encryptedMnemonic.toString(), {});
			// @ts-ignore
			SInfo.setItem(SecureStorageKeys.password, this.state.password, {});
			AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true'); // stop first time onboarding

			const user: IUser = {
				did: 'did:sov:' + generateSovrinDID(this.state.mnemonic).did,
				name: this.state.username,
				verifyKey: generateSovrinDID(this.state.mnemonic).verifyKey
			};

			AsyncStorage.setItem(UserStorageKeys.name, user.name);
			AsyncStorage.setItem(UserStorageKeys.did, user.did);
			AsyncStorage.setItem(UserStorageKeys.verifyKey, user.verifyKey);

			this.props.onUserInit(user);
			this.ledgerDidOnBlockChain(user.did, user.verifyKey);
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

	ledgerDidOnBlockChain(did: string, pubKey: string) {
		showToast(this.props.screenProps.t('register:ledgerDid'), toastType.SUCCESS);

		const newDidDoc = {
			did,
			pubKey,
			credentials: []
		};
		const payload = { didDoc: newDidDoc };

		getSignature(payload).then((signature: any) => {
			this.props.ixo.user.registerUserDid(payload, signature).then((response: any) => {
				if (response.code === 0) {
					showToast(this.props.screenProps.t('register:didLedgeredSuccess'), toastType.SUCCESS);
					this.navigateToLogin();
				} else {
					showToast(this.props.screenProps.t('register:didLedgeredError'), toastType.DANGER);
				}
			});
		});
	}

	handleCreatePassword() {
		if (this.state.confirmPassword === '' || this.state.password === '' || this.state.username === '') {
			showToast(this.props.screenProps.t('register:missingFields'), toastType.WARNING);
			return;
		}

		if (this.state.password !== this.state.confirmPassword) {
			showToast(this.props.screenProps.t('register:missmatchPassword'), toastType.WARNING);
			return;
		}

		if (this.state.password === this.state.confirmPassword) {
			this.setState({ registerState: registerSteps.revealMnemonic });
		}
	}

	renderStep(index: registerSteps) {
		switch (index) {
			case registerSteps.captureDetails:
				return (
					<KeyboardAvoidingView behavior={'position'}>
						<View style={[RegisterStyles.flexLeft]}>
							<Text style={[RegisterStyles.header]}>{this.props.screenProps.t('register:register')}</Text>
						</View>
						<View style={{ width: '100%' }}>
							<View style={RegisterStyles.divider} />
						</View>
						<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>{this.props.screenProps.t('register:letsSetup')}</Text>
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
						<DarkButton propStyles={{ marginTop: 20 }} onPress={() => this.handleCreatePassword()} text={this.props.screenProps.t('register:create')} />
					</KeyboardAvoidingView>
				);
			case registerSteps.revealMnemonic:
				return (
					<View>
						<View style={[RegisterStyles.flexLeft]}>
							<Text style={[RegisterStyles.header]}>{this.props.screenProps.t('register:secretPhrase')}</Text>
						</View>
						<View style={{ width: '100%' }}>
							<View style={RegisterStyles.divider} />
						</View>

						<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>{this.props.screenProps.t('register:secretParagraph_1')}</Text>

						<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>
							<Text style={{ textAlign: 'left', color: ThemeColors.orange, paddingBottom: 10 }}>{this.props.screenProps.t('register:warning')}:</Text>
							{this.props.screenProps.t('register:secretParagraph_2')}
						</Text>

						<TouchableOpacity onPress={() => this.generateMnemonic()} style={[RegisterStyles.selectedBox]}>
							{this.state.mnemonic.length <= 0 ? (
								<View>
									<Icon name='lock' color={ThemeColors.black} style={{ fontSize: 60, textAlign: 'center', color: ThemeColors.white }} />
									<Text style={{ textAlign: 'center', color: ThemeColors.white, paddingHorizontal: 10 }}>
										{this.props.screenProps.t('register:tapReveal')}
									</Text>
								</View>
							) : (
								<View>
									<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingHorizontal: 10 }}>{this.state.mnemonic}</Text>
								</View>
							)}
						</TouchableOpacity>
						{this.state.mnemonic.length > 0 && (
							<DarkButton
								propStyles={{ marginTop: 15 }}
								text={this.props.screenProps.t('register:next')}
								onPress={() => this.setState({ registerState: registerSteps.reenterMnemonic })}
							/>
						)}
					</View>
				);
			case registerSteps.reenterMnemonic:
				return (
					<View>
						<View style={[RegisterStyles.flexLeft]}>
							<Text style={[RegisterStyles.header]}>{this.props.screenProps.t('register:confirmSecret')}</Text>
						</View>
						<View style={{ width: '100%' }}>
							<View style={RegisterStyles.divider} />
						</View>
						<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>
							{this.props.screenProps.t('register:confirmSecretParagraph')}
						</Text>
						{this.state.errorMismatch && (
							<Text style={{ textAlign: 'left', color: ThemeColors.orange, paddingBottom: 7, fontSize: 14 }}>
								{this.props.screenProps.t('register:orderIncorrect')}
							</Text>
						)}
						{this.renderSelected()}
						{this.renderUnSelected()}
						{this.state.selectedWords.length > 0 ? (
							<DarkButton text={this.props.screenProps.t('register:confirm')} onPress={() => this.handleConfirmMnemonic()} />
						) : (
							<LightButton text={this.props.screenProps.t('register:confirm')} onPress={() => this.handleConfirmMnemonic()} />
						)}
					</View>
				);
		}
	}

	renderSelected() {
		return (
			<View style={[RegisterStyles.selected]}>
				{this.state.selectedWords.map((mnemonic: IMnemonic) => {
					return (
						<TouchableOpacity onPress={() => this.handleSelectedToUnselected(mnemonic)} key={mnemonic.word}>
							<Text style={this.state.errorMismatch ? [RegisterStyles.wordBox, { borderColor: ThemeColors.orange }] : RegisterStyles.wordBox}>
								{mnemonic.word}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}

	renderUnSelected() {
		return (
			<View style={this.state.selectedWords.length > 0 ? [RegisterStyles.unSelect] : [RegisterStyles.unSelect]}>
				{this.state.unSelectedWords.map((mnemonic: IMnemonic) => {
					return (
						<TouchableOpacity onPress={() => this.handleUnselectedToSelected(mnemonic)} key={mnemonic.key}>
							{this.state.selectedWords.length > 0 ? (
								<LinearGradient style={RegisterStyles.wordBoxGradient} colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]}>
									<Text style={{ color: ThemeColors.white }}>{mnemonic.word}</Text>
								</LinearGradient>
							) : (
								<Text style={RegisterStyles.wordBox}>{mnemonic.word}</Text>
							)}
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}

	render() {
		return (
			<Container>
				<StatusBar barStyle='light-content' />
				<ImageBackground source={background} style={[RegisterStyles.wrapper]}>
					<View style={{ height: Dimensions.get('window').height * 0.1 }} />
					{this.renderStep(this.state.registerState)}
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
)(Register);
