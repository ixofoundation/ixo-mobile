import React from 'react';
import { Modal, Dimensions, AsyncStorage, StatusBar, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Camera, Permissions } from 'expo';
import { View, Text, Icon, Item, Label, Input, Button } from 'native-base';
import { SecureStore } from 'expo';
import { connect } from 'react-redux';

import { ThemeColors } from '../styles/Colors';
import ModalStyle from '../styles/Modal';
import { IMnemonic } from '../models/sovrin';
import { Decrypt, Encrypt, generateSovrinDID } from '../utils/sovrin';
import { SecureStorageKeys, LocalStorageKeys, UserStorageKeys } from '../models/phoneStorage';
import { StackActions, NavigationActions } from 'react-navigation';

import LightButton from '../components/LightButton';
import IconEyeOff from '../../assets/svg/IconEyeOff';
import { IUser } from '../models/user';
import { initUser } from '../redux/user/user_action_creators';
const keysafelogo = require('../../assets/keysafe-logo.png');

const { height, width } = Dimensions.get('window');

interface ParentProps {
	navigation: any;
}

export interface DispatchProps {
	onUserInit: (user: IUser) => void;
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
}

export interface Props extends ParentProps, DispatchProps {}

export class ScanQR extends React.Component<Props, State> {
	static navigationOptions = ({ screenProps }: { screenProps: any }) => {
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue,
				borderBottomColor: ThemeColors.blue
			},
			headerRight: <Icon style={{ paddingRight: 10, color: ThemeColors.white }} name="flash" />,
			title: screenProps.t('scanQR:scan'),
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
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
		errors: false
	};

	async componentWillMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	}

	_handleBarCodeRead = (payload: any) => {
		if (!this.state.modalVisible) {
			this.setState({ modalVisible: true, payload: payload.data });
		}
	};

	handleUnlock = () => {
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
				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						actions: [NavigationActions.navigate({ routeName: 'Login' })]
					})
				);
			} catch (exception) {
				console.log(exception);
				this.setState({ errors: true });
			}
		}
	};

	handleResetScan = () => {
		this.setState({ password: '', modalVisible: false, payload: null, errors: false });
	};

	setModalVisible(visible: boolean) {
		this.setState({ modalVisible: visible });
	}

	renderModal() {
		const registerAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Register' })]
		});
		if (!this.state.errors) {
			return (
				// successful
				<KeyboardAvoidingView behavior={'position'}>
					<View style={ModalStyle.modalOuterContainer}>
						<View style={ModalStyle.modalInnerContainer}>
							<View style={ModalStyle.flexRight}>
								<Icon
									onPress={() => this.setModalVisible(false)}
									active
									name="close"
									style={{ color: ThemeColors.white, top: 10, fontSize: 30 }}
								/>
							</View>
							<View style={ModalStyle.flexLeft}>
								<Text style={{ color: ThemeColors.blue_lightest, fontSize: 29 }}>Scan successful</Text>
							</View>
							<View style={ModalStyle.divider} />
							<View style={ModalStyle.flexLeft}>
								<Text style={{ color: ThemeColors.white, fontSize: 15 }}>
									Unlock your existing ixo profile with your ixo Key Safe password.
								</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
								<Image
									resizeMode={'contain'}
									style={{ width: width * 0.06, height: width * 0.06, position: 'absolute', top: width * 0.06 }}
									source={keysafelogo}
								/>
								<Item
									style={{ flex: 1, borderColor: ThemeColors.blue_lightest }}
									stackedLabel={!this.state.revealPassword}
									floatingLabel={this.state.revealPassword}
								>
									<Label style={{ color: ThemeColors.blue_lightest }}>Password</Label>
									<Input
										style={{ color: ThemeColors.white }}
										value={this.state.password}
										onChangeText={password => this.setState({ password })}
										secureTextEntry={this.state.revealPassword}
									/>
								</Item>
								<TouchableOpacity onPress={() => this.setState({ revealPassword: !this.state.revealPassword })}>
									<View style={{ position: 'absolute' }}>
										<IconEyeOff width={width * 0.06} height={width * 0.06} />
									</View>
								</TouchableOpacity>
							</View>
							<LightButton onPress={() => this.handleUnlock()} text={'UNLOCK'} />
							{/* <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
              <Button onPress={() => this.handleUnlock()} bordered dark style={{ width: '100%', justifyContent: 'center' }}><Text>UNLOCK</Text></Button>
            </View> */}
						</View>
					</View>
				</KeyboardAvoidingView>
			);
		}
		return (
			<View style={ModalStyle.modalOuterContainer}>
				<View style={ModalStyle.modalInnerContainer}>
					<View style={ModalStyle.flexRight}>
						<Icon
							onPress={() => this.setModalVisible(false)}
							active
							name="close"
							style={{ color: ThemeColors.white, top: 10, fontSize: 30 }}
						/>
					</View>
					<View style={ModalStyle.flexLeft}>
						<Text style={{ color: ThemeColors.blue_lightest, fontSize: 29 }}>Scan unsuccessful</Text>
					</View>
					<View style={ModalStyle.divider} />
					<View style={ModalStyle.flexLeft}>
						<Text style={{ color: ThemeColors.white, fontSize: 15 }}>There has been an error connecting to the ixo Key Safe</Text>
					</View>
					<LightButton onPress={() => this.handleResetScan()} text={'TRY AGAIN'} />
					{/* <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
            <Button onPress={() => this.handleResetScan()} bordered dark style={{ width: '100%', justifyContent: 'center' }}><Text>TRY AGAIN</Text></Button>
          </View> */}
					{/* <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
            <Text style={{ color: ThemeColors.blue_lightest }} onPress={() => this.props.navigation.dispatch(registerAction)}>Are you registered?</Text>
          </View> */}
				</View>
			</View>
		);
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
)(ScanQR);
