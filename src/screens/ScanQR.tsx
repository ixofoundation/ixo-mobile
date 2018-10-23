import { RNCamera } from 'react-native-camera';
import SInfo from 'react-native-sensitive-info';
import { Icon, Text, Toast, View, Content, Spinner } from 'native-base';
import * as React from 'react';
import { AsyncStorage, Dimensions, Image, Modal, StatusBar, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import IconEyeOff from '../components/svg/IconEyeOff';
import { env } from '../config';
import LightButton from '../components/LightButton';
import { LocalStorageKeys, SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IMnemonic } from '../models/sovrin';
import { IUser } from '../models/user';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser } from '../redux/user/user_action_creators';
import ModalStyle from '../styles/Modal';
import { Decrypt, generateSovrinDID, getSignature } from '../utils/sovrin';
import validator from 'validator';
import IconServiceProviders from '../components/svg/iconServiceProviders';
import GenericModal from '../components/GenericModal';
import { showToast, toastType } from '../utils/toasts';

import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import ScanQRStyles from '../styles/ScanQR';

const keysafelogo = require('../../assets/keysafe-logo.png');
const qr = require('../../assets/qr.png');
const { width, height } = Dimensions.get('window');

const InfoBlocks = ({ keySafeText, qrCodeText, helpText }: { keySafeText: string; qrCodeText: string; helpText: string }) => (
	<View style={ScanQRStyles.infoBlockOuterContainer}>
		<View style={[ContainerStyles.flexRow, { alignItems: 'flex-end' }]}>
			<View style={[ContainerStyles.flexRow, ScanQRStyles.infoBlock]}>
				<Image resizeMode={'contain'} style={ScanQRStyles.infoBlockImage} source={keysafelogo} />
				<Text style={ScanQRStyles.keysafeText}>{keySafeText}</Text>
			</View>
			<View style={[ContainerStyles.flexRow, ScanQRStyles.infoBlock]}>
				<Image resizeMode={'contain'} style={ScanQRStyles.infoBlockImage} source={qr} />
				<Text style={ScanQRStyles.infoText}>{qrCodeText}</Text>
			</View>
		</View>
		<View style={ScanQRStyles.dividerContainer}>
			<View style={ScanQRStyles.divider} />
		</View>
		<View style={[ContainerStyles.flexRow, ScanQRStyles.moreInfoTextContainer]}>
			<TouchableOpacity onPress={() => console.log('TODO')}>
				<Text style={ScanQRStyles.moreInfoText}>{helpText}</Text>
			</TouchableOpacity>
		</View>
	</View>
);

const InfoBlocksServiceProvider = ({ qrCodeText, helpText }: { qrCodeText: string; helpText: string }) => (
	<View style={ScanQRStyles.infoBlockOuterContainer}>
		<View style={[ContainerStyles.flexRow, { alignItems: 'flex-end' }]}>
			<View style={[ContainerStyles.flexRow, ScanQRStyles.infoBlock]}>
				<Image resizeMode={'contain'} style={ScanQRStyles.infoBlockImage} source={qr} />
				<Text style={ScanQRStyles.infoText}>{qrCodeText}</Text>
			</View>
		</View>
		<View style={ScanQRStyles.dividerContainer}>
			<View style={ScanQRStyles.divider} />
		</View>
		<View style={[ContainerStyles.flexRow, ScanQRStyles.moreInfoTextContainer]}>
			<TouchableOpacity onPress={() => console.log('TODO')}>
				<Text style={ScanQRStyles.moreInfoText}>{helpText}</Text>
			</TouchableOpacity>
		</View>
	</View>
);

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface NavigationTypes {
	projectScan: boolean;
}

export interface DispatchProps {
	onUserInit: (user: IUser) => void;
	onIxoInit: () => void;
}
export interface StateProps {
	ixo?: any;
	user?: IUser;
}

interface State {
	type: string;
	qrFound: boolean;
	loading: boolean;
	modalVisible: boolean;
	password: string | undefined;
	revealPassword: boolean;
	payload: IMnemonic | null;
	errors: boolean;
	projectTitle: string | null;
	projectDid: string | null;
	serviceEndpoint: string | null;
	userEmail: string;
	serviceProviderAdded: boolean;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}
export class ScanQR extends React.Component<Props, State> {
	private projectScan: boolean = true;
	constructor(props) {
		super(props);

		const componentProps: NavigationTypes = this.props.navigation.state.params;
		this.projectScan = componentProps.projectScan;
		this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
	}

	static navigationOptions = ({ screenProps }: { screenProps: any }) => {
		return {
			headerStyle: { backgroundColor: ThemeColors.blue, borderBottomColor: ThemeColors.blue },
			headerRight: <Icon style={{ paddingRight: 10, color: ThemeColors.white }} name="flash" />,
			title: screenProps.t('scanQR:scan'),
			headerTitleStyle: { color: ThemeColors.white, textAlign: 'center', alignSelf: 'center' },
			headerTintColor: ThemeColors.white
		};
	};

	state = {
		type: RNCamera.Constants.Type.back,
		qrFound: false,
		loading: false,
		modalVisible: false,
		password: undefined,
		revealPassword: true,
		payload: null,
		errors: false,
		projectTitle: null,
		projectDid: null,
		serviceEndpoint: null,
		userEmail: '',
		serviceProviderAdded: false
	};

	async componentDidMount() {
		this.props.onIxoInit();
	}

	_handleBarCodeRead(payload: any) {
		if (!this.state.modalVisible) {
			if (validator.isBase64(payload.data)) {
				this.setState({ modalVisible: true, payload: payload.data });
			} else if (payload.data.includes('projects')) {
				const projectDid = payload.data.substring(payload.data.length - 39, payload.data.length - 9);
				this.setState({ modalVisible: true, payload: null, projectDid });
				this.props.ixo.project.getProjectByProjectDid(projectDid).then((project: any) => {
					this.setState({ projectTitle: project.data.title, serviceEndpoint: project.data.serviceEndpoint });
				});
			}
		}
	}

	handleUnlockPayload = () => {
		this.setState({ loading: true });
		if (this.state.payload && this.state.password) {
			try {
				const mnemonicJson: IMnemonic = Decrypt(this.state.payload, this.state.password!);
				// @ts-ignore
				SInfo.setItem(SecureStorageKeys.encryptedMnemonic, this.state.payload!, {});
				// @ts-ignore
				SInfo.setItem(SecureStorageKeys.password, this.state.password!, {});
				AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true');

				const user: IUser = {
					did: 'did:sov:' + generateSovrinDID(mnemonicJson.mnemonic).did,
					name: mnemonicJson.name,
					verifyKey: generateSovrinDID(mnemonicJson.mnemonic).verifyKey
				};
				AsyncStorage.setItem(UserStorageKeys.name, user.name);
				AsyncStorage.setItem(UserStorageKeys.did, user.did);
				AsyncStorage.setItem(UserStorageKeys.verifyKey, user.verifyKey);

				this.props.onUserInit(user);
				this.props.navigation.dispatch(StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Login' })] }));
			} catch (exception) {
				console.log(exception);
				this.setState({ errors: true, loading: false });
			}
		} else {
			this.setState({ errors: true, loading: false });
		}
	};

	handleRegisterServiceAgent = () => {
		this.setState({ loading: true });
		try {
			const agentData = {
				email: this.state.userEmail,
				name: this.props.user!.name,
				role: 'SA',
				agentDid: this.props.user!.did,
				projectDid: this.state.projectDid
			};
			getSignature(agentData).then((signature: any) => {
				this.props.ixo.agent.createAgent(agentData, signature, this.state.serviceEndpoint).then((res: any) => {
					if (res.error !== undefined) {
						showToast(res.error.message, toastType.DANGER);
						this.resetStateVars();
					} else {
						showToast(`${this.props.screenProps.t('scanQR:successRegistered')} ${agentData.role}`, toastType.SUCCESS);
						this.setState({ serviceProviderAdded: true, loading: false });
					}
				});
			});
		} catch (exception) {
			this.setState({ errors: true, loading: false });
		}
	};

	navigateToProjects() {
		this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Projects' })]
			})
		);
	}

	resetStateVars = () => {
		this.setState({
			modalVisible: false,
			password: undefined,
			payload: null,
			errors: false,
			projectDid: null,
			projectTitle: null,
			serviceEndpoint: null,
			loading: false
		});
	};

	renderInfoBlocks() {
		if (this.projectScan) {
			return (
				<InfoBlocksServiceProvider
					helpText={this.props.screenProps.t('scanQR:serviceProviderHelp')}
					qrCodeText={this.props.screenProps.t('scanQR:serviceProviderScan')}
				/>
			);
		} else {
			return (
				<InfoBlocks
					helpText={this.props.screenProps.t('scanQR:loginHelp')}
					qrCodeText={this.props.screenProps.t('connectIXO:qrCodeInfo')}
					keySafeText={this.props.screenProps.t('connectIXO:keySafeInfo')}
				/>
			);
		}
	}

	renderProjectScanned() {
		if (this.state.serviceProviderAdded) {
			return (
				<GenericModal
					onPressButton={() => this.navigateToProjects()}
					onClose={() => this.resetStateVars()}
					paragraph={this.props.screenProps.t('scanQR:serviceProviderMessage')}
					loading={this.state.loading}
					headingImage={<IconServiceProviders height={height * 0.1} width={width * 0.2} />}
					buttonText={this.props.screenProps.t('scanQR:close')}
					heading={`${this.props.screenProps.t('scanQR:welcomeMessage')} ${this.state.projectTitle}!`}
				/>
			);
		}
		return (
			<GenericModal
				onPressButton={() => this.handleRegisterServiceAgent()}
				onClose={() => this.resetStateVars()}
				paragraph={this.props.screenProps.t('connectIXOComplete:projectInformation')}
				paragraphSecondary={this.state.projectTitle}
				loading={this.state.loading}
				buttonText={this.props.screenProps.t('connectIXOComplete:registerButtonText')}
				heading={this.props.screenProps.t('connectIXOComplete:registerAsServiceAgent')}
				inputFieldOptions={{
					onChangeText: (email: string) =>
						this.setState({
							userEmail: email
						}),
					password: this.state.revealPassword,
					label: this.props.screenProps.t('scanQR:email')
				}}
			/>
		);
	}

	renderKeySafeScannedModal() {
		const registerAction = StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Register' })] });
		if (this.state.errors) {
			return (
				<GenericModal
					onPressButton={() => this.resetStateVars()}
					onClose={() => this.resetStateVars()}
					paragraph={this.props.screenProps.t('connectIXOComplete:unlockInformation')}
					loading={this.state.loading}
					buttonText={this.props.screenProps.t('scanQR:rescan')}
					heading={this.props.screenProps.t('scanQR:scanFailed')}
					infoText={this.props.screenProps.t('scanQR:registered')}
					onPressInfo={() => this.props.navigation.dispatch(registerAction)}
				/>
			);
		}
		return (
			<GenericModal
				onPressButton={() => this.handleUnlockPayload()}
				onClose={() => this.resetStateVars()}
				paragraph={this.props.screenProps.t('connectIXOComplete:unlockInformation')}
				loading={this.state.loading}
				buttonText={this.props.screenProps.t('connectIXOComplete:unlockButtonText')}
				heading={this.props.screenProps.t('connectIXOComplete:scanSuccessful')}
				inputFieldOptions={{
					onChangeText: (password: string) =>
						this.setState({
							password
						}),
					password: this.state.revealPassword,
					label: this.props.screenProps.t('scanQR:password'),
					prefixImage: <Image resizeMode={'contain'} style={ModalStyle.inputFieldPrefixImage} source={keysafelogo} />,
					suffixImage: (
						<TouchableOpacity onPress={() => this.setState({ revealPassword: !this.state.revealPassword })}>
							<View style={{ position: 'relative' }}>
								<IconEyeOff width={width * 0.06} height={width * 0.06} />
							</View>
						</TouchableOpacity>
					)
				}}
			/>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<StatusBar barStyle="light-content" />
				<Modal onRequestClose={() => null} animationType="slide" transparent={true} visible={this.state.modalVisible}>
					{this.projectScan ? this.renderProjectScanned() : this.renderKeySafeScannedModal()}
				</Modal>
				<RNCamera
					style={{ flex: 1 }}
					type={this.state.type}
					onBarCodeRead={this._handleBarCodeRead}
					flashMode={RNCamera.Constants.FlashMode.on}
					permissionDialogTitle={'Permission to use camera'}
					permissionDialogMessage={'We need your permission to use your camera phone'}
				>
					{this.renderInfoBlocks()}
				</RNCamera>
			</View>
		);
		// }
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onUserInit: (user: IUser) => {
			dispatch(initUser(user));
		},
		onIxoInit: () => {
			dispatch(initIxo(env.REACT_APP_BLOCKCHAIN_IP, env.REACT_APP_BLOCK_SYNC_URL));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ScanQR);
