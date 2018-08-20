import React from 'react';
import { Modal, StatusBar } from 'react-native';
import { Camera, Permissions } from 'expo';
import { View, Text } from 'native-base';
import { connect } from 'react-redux';

interface ParentProps {
	navigation: any;
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

export interface Props extends ParentProps {}

export class CameraCapture extends React.Component<Props, State> {
	// static navigationOptions = ({ screenProps }: { screenProps: any }) => {
	// 	return {
	// 		headerStyle: {
	// 			backgroundColor: ThemeColors.blue,
	// 			borderBottomColor: ThemeColors.blue
	// 		},
	// 		headerRight: <Icon style={{ paddingRight: 10, color: ThemeColors.white }} name="flash" />,
	// 		title: screenProps.t('scanQR:scan'),
	// 		headerTitleStyle: {
	// 			color: ThemeColors.white,
	// 			textAlign: 'center',
	// 			alignSelf: 'center'
	// 		},
	// 		headerTintColor: ThemeColors.white
	// 	};
	// };

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
					{/* <Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalVisible}
						onRequestClose={() => {
							alert('Modal has been closed.');
						}}
					>
						{this.renderModal()}
					</Modal> */}
					<Camera style={{ flex: 1 }} type={this.state.type} />
				</View>
			);
		}
	}
}

// function mapDispatchToProps(dispatch: any): DispatchProps {
// 	return {
// 		onUserInit: (user: IUser) => {
// 			dispatch(initUser(user));
// 		}
// 	};
// }

export default CameraCapture;