import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/svg/CustomIcons';
import { Container, Icon, Text, View, Content } from 'native-base';
import React from 'react';
import { AsyncStorage, Dimensions, ImageBackground, KeyboardAvoidingView, StatusBar, TouchableOpacity } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import _ from 'underscore';
import { env } from '../config';
import DarkButton from '../components/DarkButton';
import InputField from '../components/InputField';
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
import { ValidationHelper, ValidationModelTypes, IRegisterValidationModel } from '../utils/validationHelper';

const { height } = Dimensions.get('window');
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
	selected: boolean;
}

export interface DispatchProps {
	onUserInit: (user: IUser) => void;
	onIxoInit: () => void;
}

export interface StateProps {
	ixo?: any;
}

interface StateTypes {
	userInputs: IRegisterValidationModel;
	registerState: registerSteps;
	mnemonic: string;
	selectedWords: IMnemonic[] | any[];
	unSelectedWords: IMnemonic[] | any[];
	errorMismatch: boolean;
	userEnteredMnemonicCorrect: boolean;
	loading: boolean;
	registerValidationErrors: IRegisterValidationModel;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}

class Register extends React.Component<Props, StateTypes> {
	private validator: ValidationHelper = new ValidationHelper(ValidationModelTypes.Register);
	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const { params = {} } = navigation.state;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark,
				elevation: 0
			},
			headerLeft: <Icon name="arrow-back" onPress={() => params.onBackButton()} style={{ paddingLeft: 10, color: ThemeColors.white }} />,
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	};

	state = {
		registerState: registerSteps.captureDetails,
		mnemonic: '',
		selectedWords: [],
		unSelectedWords: [],
		errorMismatch: false,
		userEnteredMnemonicCorrect: false,
		loading: false,
		userInputs: this.validator.GetRegisterModel(),
		registerValidationErrors: this.validator.GetRegisterModel()
	};

	componentDidMount() {
		this.props.onIxoInit();
		this.props.navigation.setParams({ onBackButton: this.onBackButton });
	}

	onBackButton = () => {
		if (this.state.registerState === registerSteps.captureDetails) {
			this.props.navigation.pop();
		} else if (this.state.registerState === registerSteps.revealMnemonic) {
			this.setState({ registerState: registerSteps.captureDetails });
		} else if (this.state.registerState === registerSteps.reenterMnemonic) {
			this.setState({ registerState: registerSteps.revealMnemonic });
		} else {
			this.props.navigation.pop();
		}
	};

	async generateMnemonic() {
		const mnemonic = await bip39.generateMnemonic();
		const mnemonicArray: IMnemonic[] = [];
		_.each(this.shuffleArray(mnemonic.split(' ')), (word, index) => {
			mnemonicArray.push({ key: index, word, selected: false });
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
		if (!this.state.selectedWords.includes(mnemonic)) {
			selectedWords.push(mnemonic);
		}
		const mnemonicWords: IMnemonic[] = [...this.state.unSelectedWords];
		const mnemonicWord = mnemonicWords.find((e: IMnemonic) => e.key === mnemonic.key);
		mnemonicWord.selected = true;
		this.setState({
			unSelectedWords: mnemonicWords,
			selectedWords
		});

		const mnemonicEntered: string = this.getMnemonicString(this.state.selectedWords);
		if (this.state.selectedWords.length === this.state.unSelectedWords.length && mnemonicEntered !== this.state.mnemonic) {
			this.setState({ errorMismatch: true });
		} else if (this.state.selectedWords.length === this.state.unSelectedWords.length && mnemonicEntered === this.state.mnemonic) {
			this.setState({ userEnteredMnemonicCorrect: true });
		}
	}

	handleSelectedToUnselected(mnemonic: IMnemonic) {
		const mnemonicWords: IMnemonic[] = [...this.state.unSelectedWords];
		const mnemonicWord = mnemonicWords.find((e: IMnemonic) => e.key === mnemonic.key);
		mnemonicWord.selected = false;

		this.setState({
			selectedWords: this.state.selectedWords.filter((e: IMnemonic) => e.key !== mnemonic.key),
			unSelectedWords: mnemonicWords
		});

		if (this.state.errorMismatch) {
			this.setState({ errorMismatch: false, userEnteredMnemonicCorrect: false });
		}
	}

	getMnemonicString(mnemonicArray: IMnemonic[]) {
		const mnemonicString: string[] = [];
		_.each(mnemonicArray, (mnemonic: IMnemonic) => {
			mnemonicString.push(mnemonic.word);
		});
		return mnemonicString.join(' ');
	}

	handleConfirmMnemonic() {
		this.setState({ loading: true });
		if (this.getMnemonicString(this.state.selectedWords) !== this.state.mnemonic) {
			this.setState({ errorMismatch: true, loading: false });
		} else {
			const encryptedMnemonic = Encrypt(JSON.stringify({ mnemonic: this.state.mnemonic, name: this.state.userInputs.username }), this.state.userInputs.password); // encrypt securely on phone enlave
			// @ts-ignore
			SInfo.setItem(SecureStorageKeys.encryptedMnemonic, encryptedMnemonic.toString(), {});
			// @ts-ignore
			// SInfo.setItem(SecureStorageKeys.password, this.state.password, {});
			AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true'); // stop first time onboarding

			const user: IUser = {
				did: 'did:sov:' + generateSovrinDID(this.state.mnemonic).did,
				name: this.state.userInputs.username,
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
		const newDidDoc = {
			did,
			pubKey,
			credentials: []
		};
		const payload = { didDoc: newDidDoc };

		getSignature(payload)
			.then((signature: any) => {
				this.props.ixo.user
					.registerUserDid(payload, signature)
					.then((response: any) => {
						if (response.code === 0) {
							showToast(this.props.screenProps.t('register:didLedgeredSuccess'), toastType.SUCCESS);
							this.navigateToLogin();
						} else {
							showToast(this.props.screenProps.t('register:didLedgeredError'), toastType.DANGER);
							this.setState({ loading: false });
						}
						console.log('Error', response);
					})
					.catch(error => {
						console.log('Error', error);
						showToast(this.props.screenProps.t('register:failedToLedgerUser'), toastType.DANGER);
						this.setState({ loading: false });
					});
			})
			.catch(error => {
				console.log('Error', error);
			});
	}

	handleTextChange() {
		const errorModel = this.validator.ValidateFields(this.state.userInputs);
		const updatedErrorModel = errorModel.errorModel as IRegisterValidationModel;
		this.setState({ registerValidationErrors: updatedErrorModel });
	}

	handleCreatePassword() {
		const errorModel = this.validator.ValidateFields(this.state.userInputs);
		const updatedErrorModel = errorModel.errorModel as IRegisterValidationModel;
		if (errorModel.errorsFound) {
			this.setState({ registerValidationErrors: updatedErrorModel });
		} else {
			this.setState({ registerState: registerSteps.revealMnemonic, registerValidationErrors: updatedErrorModel });
		}
	}

	renderStep(index: registerSteps) {
		switch (index) {
			case registerSteps.captureDetails:
				return (
					<Content>
						<KeyboardAvoidingView behavior={'padding'}>
							<View style={[RegisterStyles.flexLeft]}>
								<Text style={[RegisterStyles.header]}>{this.props.screenProps.t('register:register')}</Text>
							</View>
							<View style={{ width: '100%' }}>
								<View style={RegisterStyles.divider} />
							</View>
							<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>{this.props.screenProps.t('register:letsSetup')}</Text>
							<InputField
								error={this.state.registerValidationErrors.username}
								value={this.state.userInputs.username}
								labelName={this.props.screenProps.t('register:yourName')}
								onChangeText={(text: string) => {
									this.setState({ userInputs: { ...this.state.userInputs, username: text } });
									this.handleTextChange();
								}}
							/>
							<InputField
								error={this.state.registerValidationErrors.email}
								value={this.state.userInputs.email}
								labelName={this.props.screenProps.t('register:yourEmail')}
								onChangeText={(text: string) => {
									this.setState({ userInputs: { ...this.state.userInputs, email: text } });
									this.handleTextChange();
								}}
							/>
							<InputField
								error={this.state.registerValidationErrors.password}
								password={true}
								value={this.state.userInputs.password}
								labelName={this.props.screenProps.t('register:newPassword')}
								onChangeText={(text: string) => {
									this.setState({ userInputs: { ...this.state.userInputs, password: text } });
									this.handleTextChange();
								}}
							/>
							<InputField
								error={this.state.registerValidationErrors.confirmPassword}
								password={true}
								value={this.state.userInputs.confirmPassword}
								labelName={this.props.screenProps.t('register:confirmPassword')}
								onChangeText={(text: string) => {
									this.setState({ userInputs: { ...this.state.userInputs, confirmPassword: text } });
									this.handleTextChange();
								}}
							/>
							<DarkButton propStyles={{ marginTop: 20 }} onPress={() => this.handleCreatePassword()} text={this.props.screenProps.t('register:create')} />
							<TouchableOpacity style={{ paddingBottom: 30 }} onPress={() => this.props.navigation.navigate('Recover')}>
								<Text style={RegisterStyles.recoverText}>{this.props.screenProps.t('register:recoverAccount')}</Text>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					</Content>
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

						<TouchableOpacity disabled={this.state.mnemonic.length > 0} onPress={() => this.generateMnemonic()} style={[RegisterStyles.selectedBox]}>
							{this.state.mnemonic.length <= 0 ? (
								<View>
									<CustomIcon
										name="lock"
										color={ThemeColors.black}
										style={{ fontSize: 30, textAlign: 'center', color: ThemeColors.white }}
										size={height * 0.03}
									/>
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
						<DarkButton
							disabled={this.state.mnemonic.length <= 0}
							propStyles={{ marginTop: 15 }}
							text={this.props.screenProps.t('register:next')}
							onPress={() => this.setState({ registerState: registerSteps.reenterMnemonic })}
						/>
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
						<DarkButton
							loading={this.state.loading}
							disabled={!this.state.userEnteredMnemonicCorrect}
							text={this.props.screenProps.t('register:confirm')}
							onPress={() => this.handleConfirmMnemonic()}
						/>
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
				<Content>
					<View style={this.state.selectedWords.length > 0 ? [RegisterStyles.unSelect] : [RegisterStyles.unSelect]}>
						{this.state.unSelectedWords.map((mnemonicWord: IMnemonic) => {
							return (
								<TouchableOpacity onPress={() => this.handleUnselectedToSelected(mnemonicWord)} key={mnemonicWord.key}>
									{mnemonicWord.selected ? (
										<LinearGradient style={RegisterStyles.wordBoxGradient} colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]}>
											<Text style={{ color: ThemeColors.white }}>{mnemonicWord.word}</Text>
										</LinearGradient>
									) : (
										<Text style={RegisterStyles.wordBox}>{mnemonicWord.word}</Text>
									)}
								</TouchableOpacity>
							);
						})}
					</View>
				</Content>
			</View>
		);
	}

	render() {
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<ImageBackground source={background} style={[RegisterStyles.wrapper]}>
					{/* <View style={{ height: Dimensions.get('window').height * 0.1 }} /> */}
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
