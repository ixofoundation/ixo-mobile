import { Camera, Permissions, SecureStore } from 'expo';
import { Icon, Input, Item, Label, Text, View } from 'native-base';
import React from 'react';
import { AsyncStorage, Dimensions, Image, KeyboardAvoidingView, Modal, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';
import IconEyeOff from '../../assets/svg/IconEyeOff';
import { env } from '../../config';
import LightButton from '../components/LightButton';
import { showToastMessage, ToastPosition, ToastType } from '../lib/util/toast';
import { LocalStorageKeys, SecureStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { IMnemonic } from '../models/sovrin';
import { IUser } from '../models/user';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { initUser } from '../redux/user/user_action_creators';
import { ThemeColors } from '../styles/Colors';
import ModalStyle from '../styles/Modal';
import { Decrypt, generateSovrinDID, getSignature } from '../utils/sovrin';

const keysafelogo = require('../../assets/keysafe-logo.png');
const { height, width } = Dimensions.get('window');

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
	hasCameraPermission: boolean;
	type: string;
	qrFound: boolean;
	loading: boolean;
	modalVisible: boolean;
	password: string;
	revealPassword: boolean;
	payload: IMnemonic | null;
	errors: boolean;
	projectTitle: string;
	projectDid: string;
	serviceEndpoint: string;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}

export class ScanQR extends React.Component<Props, State> {
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
		hasCameraPermission: false,
		type: Camera.Constants.Type.back,
		qrFound: false,
		loading: false,
		modalVisible: false,
		password: '',
		revealPassword: true,
		payload: null,
		errors: false,
		projectTitle: '',
		projectDid: '',
		serviceEndpoint: ''
	};

	async componentWillMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	}

	async componentDidMount() {
		this.props.onIxoInit();
	}

	resetProjectStateVars() {
		this.setState({ projectTitle: '', serviceEndpoint: '', projectDid: '' });
	}

	_handleBarCodeRead = (payload: any) => {
		if (!this.state.modalVisible) {
			this.setState({ modalVisible: true, payload: payload.data });
		}

		if (payload.data.includes('projects')) {
			const projectDid = payload.data.substring(payload.data.length - 39, payload.data.length - 9);
			this.setState({ projectDid: projectDid });
			this.props.ixo.project.getProjectByProjectDid(projectDid).then((project: any) => {
				this.setState({ projectTitle: project.data.title, serviceEndpoint: project.data.serviceEndpoint });
			});
		} else {
			this.resetProjectStateVars();
		}
	};

	handleButtonPress = () => {
		if (this.state.payload && this.state.password) {
			try {
				const mnemonicJson: IMnemonic = Decrypt(this.state.payload, this.state.password);
				SecureStore.setItemAsync(SecureStorageKeys.encryptedMnemonic, this.state.payload!);
				SecureStore.setItemAsync(SecureStorageKeys.password, this.state.password);
				AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true');

				let user: IUser = {
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
					console.log('Response: ' + JSON.stringify(res));
					if (res.error !== undefined) {
						showToastMessage(res.error.message, ToastType.DANGER, ToastPosition.TOP);
						this.navigateToProjects();
					} else {
						showToastMessage(this.props.screenProps.t('scanQR:projectInformation') + agentData.role, ToastType.SUCCESS, ToastPosition.TOP);
						this.navigateToProjects();
					}
				});
			});
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

	handleResetScan = () => {
		this.setState({ password: '', modalVisible: false, payload: null, errors: false });
	};

	setModalVisible(visible: boolean) {
		this.setState({ modalVisible: visible });
	}

	renderDescriptionText() {
		if (this.state.projectDid) {
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
		if (!this.state.projectDid) {
			return (
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
					<Image resizeMode={'contain'} style={{ width: width * 0.06, height: width * 0.06, position: 'absolute', top: width * 0.06 }} source={keysafelogo} />
					<Item style={{ flex: 1, borderColor: ThemeColors.blue_lightest }} stackedLabel={!this.state.revealPassword} floatingLabel={this.state.revealPassword}>
						<Label style={{ color: ThemeColors.blue_lightest }}>Password</Label>
						<Input
							style={{ color: ThemeColors.white }}
							value={this.state.password}
							onChangeText={(password: string) =>
								this.setState({
									password
								})
							}
							secureTextEntry={this.state.revealPassword}
						/>
					</Item>
					<TouchableOpacity onPress={() => this.setState({ revealPassword: !this.state.revealPassword })}>
						<View style={{ position: 'absolute' }}>
							<IconEyeOff width={width * 0.06} height={width * 0.06} />
						</View>
					</TouchableOpacity>
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
				<KeyboardAvoidingView behavior={'position'}>
					<View style={ModalStyle.modalOuterContainer}>
						<View style={ModalStyle.modalInnerContainer}>
							<View style={ModalStyle.flexRight}>
								<Icon onPress={() => this.setModalVisible(false)} active name="close" style={{ color: ThemeColors.white, top: 10, fontSize: 30 }} />
							</View>
							<View style={ModalStyle.flexLeft}>
								<Text style={{ color: ThemeColors.blue_lightest, fontSize: 29 }}>
									{this.state.projectDid
										? this.props.screenProps.t('scanQR:registerAsServiceAgent')
										: this.props.screenProps.t('scanQR:scanSuccessful')}
								</Text>
							</View>
							<View style={ModalStyle.divider} />
							{this.renderDescriptionText()}
							<Text style={{ color: ThemeColors.blue_lightest, fontSize: 18 }}>{this.state.projectTitle}</Text>
							{this.renderPasswordField()}
							<LightButton
								onPress={() => this.handleButtonPress()}
								text={
									this.state.projectDid
										? this.props.screenProps.t('scanQR:registerButtonText')
										: this.props.screenProps.t('scanQR:unlockButtonText')
								}
							/>
						</View>
					</View>
				</KeyboardAvoidingView>
			);
		} else {
			return (
				<View style={ModalStyle.modalOuterContainer}>
					<View style={ModalStyle.modalInnerContainer}>
						<View style={ModalStyle.flexRight}>
							<Icon onPress={() => this.setModalVisible(false)} active name="close" style={{ color: ThemeColors.white, top: 10, fontSize: 30 }} />
						</View>
						<View style={ModalStyle.flexLeft}>
							<Text style={{ color: ThemeColors.blue_lightest, fontSize: 29 }}>Scan unsuccessful</Text>
						</View>
						<View style={ModalStyle.divider} />
						<View style={ModalStyle.flexLeft}>
							<Text style={{ color: ThemeColors.white, fontSize: 15 }}>There has been an error connecting to the ixo Key Safe</Text>
						</View>
						<LightButton onPress={() => this.handleResetScan()} text={'TRY AGAIN'} />
					</View>
				</View>
			);
		}
	}

	render() {
		const { hasCameraPermission, loading } = this.state;
		if (hasCameraPermission === null) {
			return <View />;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else if (loading === true) {
			return <Text>Loading...</Text>;
		} else {
			return (
				<View style={{ flex: 1 }}>
					<StatusBar barStyle="light-content" />
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalVisible}
						onRequestClose={() => {
							alert('Modal has been closed.');
						}}
					>
						{this.renderModal()}
					</Modal>
					<Camera style={{ flex: 1 }} type={this.state.type} onBarCodeRead={this._handleBarCodeRead} />
				</View>
			);
		}
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
