import React from 'react';
import { SecureStore, LinearGradient } from 'expo';
import { Dimensions, StatusBar, TouchableOpacity, AsyncStorage, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Container, Icon, View, Item, Label, Input, Button, Text, Toast } from 'native-base';
import { Encrypt, generateSovrinDID } from '../utils/sovrin';
import { SecureStorageKeys, LocalStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { ThemeColors, ButtonDark } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import RegisterStyles from '../styles/Register';
import { IUser } from '../models/user';
import { initUser } from '../redux/user/user_action_creators';
import { connect } from 'react-redux';
import DarkButton from '../components/DarkButton';
import InputField from '../components/InputField';
import LightButton from '../components/LightButton';
var bip39 = require('react-native-bip39');

const background = require('../../assets/backgrounds/background_1.png');

enum registerSteps {
	captureDetails = 1,
	revealMnemonic,
	reenterMnemonic
}

interface ParentProps {
	navigation: any;
	screenProps: any;
}

export interface DispatchProps {
	onUserInit: (user: IUser) => void;
}

interface StateTypes {
	username: string;
	password: string;
	confirmPassword: string;
	registerState: registerSteps;
	mnemonic: string;
	selectedWords: string[];
	unSelectedWords: string[];
	errorMismatch: boolean;
}

export interface Props extends ParentProps, DispatchProps {}

class Register extends React.Component<Props, StateTypes> {
	static navigationOptions = ({ navigation }: { navigation: any }) => {
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			// headerRight: <HeaderSync />,
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
		registerState: registerSteps.captureDetails,
		mnemonic: '',
		selectedWords: [],
		unSelectedWords: [],
		errorMismatch: false
	};

	async generateMnemonic() {
		const mnemonic = await bip39.generateMnemonic();
		this.setState({ unSelectedWords: this.shuffleArray(mnemonic.split(' ')), mnemonic: mnemonic });
	}

	shuffleArray(array: string[]) {
		// Durstenfeld shuffle algorithm
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
		}
		return array;
	}

	handleUnselectedToSelected(word: string) {
		const selectedWords: string[] = this.state.selectedWords;
		selectedWords.push(word);
		this.setState({
			unSelectedWords: this.state.unSelectedWords.filter(e => e !== word),
			selectedWords: selectedWords
		});
	}

	handleSelectedToUnselected(word: string) {
		const unSelectedWords: string[] = this.state.unSelectedWords;
		unSelectedWords.push(word);
		this.setState({
			selectedWords: this.state.selectedWords.filter(e => e !== word),
			unSelectedWords: unSelectedWords
		});
	}

	handleConfirmMnemonic() {
		const goToLogin = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Login' })]
		});
		if (this.state.selectedWords.join(' ') !== this.state.mnemonic) {
			this.setState({ errorMismatch: true });
		} else {
			const cipherTextMnemonic = Encrypt(JSON.stringify({ username: this.state.username, mnemonic: this.state.mnemonic }), this.state.password); // encrypt securely on phone enlave
			SecureStore.setItemAsync(SecureStorageKeys.encryptedMnemonic, cipherTextMnemonic);
			const cipherTextSovrinDid = Encrypt(JSON.stringify(generateSovrinDID(this.state.mnemonic)), this.state.password); // encrypt securely on phone enlave
			SecureStore.setItemAsync(SecureStorageKeys.sovrinDid, cipherTextSovrinDid);
			SecureStore.setItemAsync(SecureStorageKeys.password, this.state.password); // save local password
			AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true'); // stop first time onboarding
			let user: IUser = {
				did: 'did:sov:' + generateSovrinDID(this.state.mnemonic).did,
				name: this.state.username,
				verifyKey: generateSovrinDID(this.state.mnemonic).verifyKey
			};

			AsyncStorage.setItem(UserStorageKeys.name, user.name);
			AsyncStorage.setItem(UserStorageKeys.did, user.did);
			AsyncStorage.setItem(UserStorageKeys.verifyKey, user.verifyKey);

			this.props.onUserInit(user);
			this.props.navigation.dispatch(goToLogin);
		}
	}

	handleCreatePassword() {
		if (this.state.confirmPassword === '' || this.state.password === '' || this.state.username === '') {
			Toast.show({
				text: 'Missing fields',
				type: 'warning',
				position: 'top'
			});
			return;
		}

		if (this.state.password !== this.state.confirmPassword) {
			Toast.show({
				text: 'Mismatch on password',
				type: 'warning',
				position: 'top'
			});
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
						<InputField value={this.state.username} labelName={this.props.screenProps.t('register:yourName')} onChangeText={(text: string) => this.setState({ username: text })} />
						<InputField password={true} value={this.state.password} labelName={this.props.screenProps.t('register:newPassword')} onChangeText={(text: string) => this.setState({ password: text })} />
						<InputField password={true} value={this.state.confirmPassword} labelName={this.props.screenProps.t('register:confirmPassword')} onChangeText={(text: string) => this.setState({ confirmPassword: text })} />
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

						<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>
							{this.props.screenProps.t('register:secretParagraph_1')}
						</Text>

						<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingBottom: 10 }}>
							<Text style={{ textAlign: 'left', color: ThemeColors.orange, paddingBottom: 10 }}>
								{this.props.screenProps.t('register:warning')}: 
							</Text>
							 {this.props.screenProps.t('register:secretParagraph_2')}
						</Text>

						<TouchableOpacity onPress={() => this.generateMnemonic()} style={[RegisterStyles.selectedBox]}>
							{this.state.mnemonic.length <= 0 ? (
								<View>
									<Icon name="lock" color={ThemeColors.black} style={{ fontSize: 60, textAlign: 'center', color: ThemeColors.white }} />
									<Text style={{ textAlign: 'center', color: ThemeColors.white, paddingHorizontal: 10 }}>{this.props.screenProps.t('register:tapReveal')}</Text>
								</View>
							) : (
								<View>
									<Text style={{ textAlign: 'left', color: ThemeColors.white, paddingHorizontal: 10 }}>{this.state.mnemonic}</Text>
								</View>
							)}
						</TouchableOpacity>
						{this.state.mnemonic.length > 0 && (
							<DarkButton propStyles={{ marginTop: 15 }} text={'Next'} onPress={() => this.setState({ registerState: registerSteps.reenterMnemonic })} />
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
						{this.state.errorMismatch && <Text style={{ textAlign: 'left', color: ThemeColors.orange, paddingBottom: 7, fontSize: 10 }}>{this.props.screenProps.t('register:orderIncorrect')}</Text>}
						{this.renderSelected()}
						{this.renderUnSelected()}
						{(this.state.selectedWords.length > 0) ? 
						<DarkButton text={this.props.screenProps.t('register:confirm')} onPress={() => this.handleConfirmMnemonic()} />
						:
						<LightButton text={this.props.screenProps.t('register:confirm')} onPress={() => this.handleConfirmMnemonic()} />
						}
						
					</View>
				);
		}
	}

	renderSelected() {
		return (
			<View style={[RegisterStyles.selected]}>
				{this.state.selectedWords.map(word => {
					return (
						<TouchableOpacity onPress={() => this.handleSelectedToUnselected(word)} key={word}>
							<Text style={(this.state.errorMismatch) ? [RegisterStyles.wordBox, { borderColor: ThemeColors.orange }] : RegisterStyles.wordBox}>{word}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}

	renderUnSelected() {
		return (
			<View style={(this.state.selectedWords.length > 0) ? [RegisterStyles.unSelect] : [RegisterStyles.unSelect]}>
				{this.state.unSelectedWords.map(word => {
					return (
						<TouchableOpacity onPress={() => this.handleUnselectedToSelected(word)} key={word}>
						{((this.state.selectedWords.length > 0)) ? 
							<LinearGradient
								style={RegisterStyles.wordBoxGradient}
								colors={[ButtonDark.colorPrimary, ButtonDark.colorSecondary]}
							>
								<Text style={{ color: ThemeColors.white }}>{word}</Text>
							</LinearGradient>
						:
							<Text style={RegisterStyles.wordBox}>{word}</Text>
						}
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}

	render() {
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<ImageBackground source={background} style={[RegisterStyles.wrapper]}>
					<View style={{ height: Dimensions.get('window').height * 0.1 }} />
					{this.renderStep(this.state.registerState)}
				</ImageBackground>
			</Container>
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

export default connect(
	null,
	mapDispatchToProps
)(Register);
