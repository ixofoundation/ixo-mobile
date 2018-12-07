import React from 'react';
import { View, Spinner } from 'native-base';
import { Modal } from 'react-native';
import { ThemeColors } from '../styles/Colors';

import ModalStyle from '../styles/Modal';

interface State {}

interface ParentProps {
	isModalVisible: boolean;
}

interface Props extends ParentProps {}

export default class LoadingModal extends React.Component<Props, State> {
	render() {
		return (
			<Modal animationType="none" transparent={true} visible={this.props.isModalVisible}>
				<View>
					<View style={[ModalStyle.overlayContainer]} />
					<View style={[ModalStyle.modalOuterContainer, { marginTop: 0, alignItems: 'center' }]}>
						<View style={ModalStyle.modalInnerContainer}>
							<Spinner color={ThemeColors.white} />
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}
