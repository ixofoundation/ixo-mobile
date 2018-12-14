import React from 'react';
import { View, Icon } from 'native-base';
import { Modal, Image, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import ModalStyle from '../styles/Modal';

interface State {}

interface ParentProps {
	isModalVisible: boolean;
	uri: string;
	onClose?: Function;
}

interface Props extends ParentProps {}

export default class ImageViewerModal extends React.Component<Props, State> {
	render() {
		return (
			<Modal animationType="none" transparent={true} visible={this.props.isModalVisible}>
				<View style={{ position: 'absolute', width, height, backgroundColor: 'black', zIndex: 4, opacity: 1 }}>
					<View style={[ModalStyle.modalOuterContainer]}>
						<View style={ModalStyle.modalInnerContainer}>
							<View style={[ModalStyle.modalWrapper]}>
								<View style={ModalStyle.flexRight}>
									<Icon onPress={() => this.props.onClose()} active name="close" style={ModalStyle.closeIcon} />
								</View>
								<Image style={{ width: '100%', height: '60%' }} resizeMode={'contain'} source={{ uri: this.props.uri }} />
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}
