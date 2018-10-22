import { RNCamera } from 'react-native-camera';
import SInfo from 'react-native-sensitive-info';
import { Icon, Text, Toast, View } from 'native-base';
import * as React from 'react';
import { AsyncStorage, Dimensions, Image, KeyboardAvoidingView, Modal, StatusBar, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
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
import { InputField } from '../components/InputField';

import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import ScanQRStyles from '../styles/ScanQR';

const keysafelogo = require('../../assets/keysafe-logo.png');
const qr = require('../../assets/qr.png');
const { width } = Dimensions.get('window');

const InfoBlocks = ({ keySafeText, qrCodeText, helpText }: { keySafeText: string; qrCodeText: string, helpText: string }) => (
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

interface ParentProps {
	navigation: any;
	screenProps: any;
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
	cameraActive: boolean;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}
export class ScanQR extends React.Component<Props, State> {
	constructor(props) {
		super(props);

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
		cameraActive: true
	};

	async componentDidMount() {
		this.props.onIxoInit();
	}

	_handleBarCodeRead(payload: any) {
		this.disableCamera();
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

	disableCamera() {
		if (Platform.OS === 'android') {
			// this.setState({ cameraActive: false });
		}
	}

	handleButtonPress = () => {
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
				this.setState({ errors: true });
			}
		} else if (this.state.projectDid) {
			const agentData = {
				email: 'nicolaas@trustlab.tech',
				name: this.props.user!.name,
				role: 'SA',
				agentDid: this.props.user!.did,
				projectDid: this.state.projectDid
			};
			getSignature(agentData).then((signature: any) => {
				this.props.ixo.agent.createAgent(agentData, signature, this.state.serviceEndpoint).then((res: any) => {
					if (res.error !== undefined) {
						Toast.show({
							text: res.error.message,
							type: 'danger',
							position: 'top'
						});
						this.navigateToProjects();
					} else {
						Toast.show({
							text: `Successfully registered as ${agentData.role}`,
							type: 'success',
							position: 'top'
						});
						this.navigateToProjects();
					}
				});
			});
		} else {
			this.setState({ errors: true });
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
		this.setState({ modalVisible: false, password: undefined, payload: null, errors: false, projectDid: null, projectTitle: null, serviceEndpoint: null });

	};

	renderDescriptionText() {
		if (this.state.projectDid !== null) {
			return (
				<View style={ModalStyle.flexLeft}>
					<Text style={{ color: ThemeColors.white, fontSize: 15 }}>{this.props.screenProps.t('connectIXOComplete:projectInformation')}</Text>
				</View>
			);
		} else {
			return (
				<View style={ModalStyle.flexLeft}>
					<Text style={{ color: ThemeColors.white, fontSize: 15 }}>{this.props.screenProps.t('connectIXOComplete:unlockInformation')}</Text>
				</View>
			);
		}
	}

	renderPasswordField() {
		if (this.state.projectDid === null) {
			return (
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
					<Image resizeMode={'contain'} style={{ width: width * 0.06, height: width * 0.06, position: 'absolute', top: width * 0.06 }} source={keysafelogo} />
					<InputField
						password={this.state.revealPassword}
						icon={
							<TouchableOpacity onPress={() => this.setState({ revealPassword: !this.state.revealPassword })}>
								<View style={{ position: 'relative' }}>
									<IconEyeOff width={width * 0.06} height={width * 0.06} />
								</View>
							</TouchableOpacity>
						}
						labelName={'Password'}
						onChangeText={(password: string) =>
							this.setState({
								password
							})
						}
					/>
				</View>
			);
		} else {
			return null;
		}
	}

	renderModal() {
		const registerAction = StackActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Register' })] });
		if (!this.state.errors) {
			return (
				<View style={ModalStyle.modalOuterContainer}>
					<View style={ModalStyle.modalInnerContainer}>
						<View style={ModalStyle.flexRight}>
							<Icon onPress={() => this.resetStateVars()} active name="close" style={{ color: ThemeColors.white, top: 10, fontSize: 30 }} />
						</View>
						<View style={ModalStyle.flexLeft}>
							<Text style={{ color: ThemeColors.blue_lightest, fontSize: 29 }}>
								{this.state.projectDid !== null
									? this.props.screenProps.t('connectIXOComplete:registerAsServiceAgent')
									: this.props.screenProps.t('connectIXOComplete:scanSuccessful')}
							</Text>
						</View>
						<View style={ModalStyle.divider} />
						{this.renderDescriptionText()}
						<Text style={{ color: ThemeColors.blue_lightest, fontSize: 18 }}>{this.state.projectTitle}</Text>
						{this.renderPasswordField()}
						<LightButton
							onPress={() => this.handleButtonPress()}
							text={
								this.state.projectDid !== null
									? this.props.screenProps.t('connectIXOComplete:registerButtonText')
									: this.props.screenProps.t('connectIXOComplete:unlockButtonText')
							}
						/>
					</View>
				</View>
			);
		}
		return (
			<View style={ModalStyle.modalOuterContainer}>
				<View style={ModalStyle.modalInnerContainer}>
					<View style={ModalStyle.flexRight}>
						<Icon name="close" style={{ color: ThemeColors.white, top: 10, fontSize: 30 }} />
					</View>
					<View style={ModalStyle.flexLeft}>
						<Text style={{ color: ThemeColors.blue_lightest, fontSize: 29 }}>Scan unsuccessful</Text>
					</View>
					<View style={ModalStyle.divider} />
					<View style={ModalStyle.flexLeft}>
						<Text style={{ color: ThemeColors.white, fontSize: 15 }}>There has been an error connecting to the ixo Key Safe</Text>
					</View>
					<LightButton onPress={() => this.resetStateVars()} text={this.props.screenProps.t('scanQR:rescan')} />
					<TouchableOpacity onPress={() => this.props.navigation.dispatch(registerAction)}>
						<Text style={{ color: ThemeColors.blue_lightest, fontSize: 15, textDecorationLine: 'underline', textAlign: 'center' }}>Are you registered?</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<StatusBar barStyle="light-content" />
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						// alert('Modal has been closed.');
					}}
				>
					{this.renderModal()}
				</Modal>
				{this.state.cameraActive ? (
					<RNCamera
						style={{ flex: 1 }}
						type={this.state.type}
						onBarCodeRead={this._handleBarCodeRead}
						flashMode={RNCamera.Constants.FlashMode.on}
						permissionDialogTitle={'Permission to use camera'}
						permissionDialogMessage={'We need your permission to use your camera phone'}
					>
						<InfoBlocks helpText={this.props.screenProps.t('scanQR:loginHelp')} qrCodeText={this.props.screenProps.t('connectIXO:qrCodeInfo')} keySafeText={this.props.screenProps.t('connectIXO:keySafeInfo')} />
					</RNCamera>
				) : null}
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
