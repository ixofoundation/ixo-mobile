import React from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Text } from 'native-base';

import ContainerStyles from '../styles/Containers';
import HeaderSyncStyles from '../styles/componentStyles/HeaderSync';
import { ThemeColors } from '../styles/Colors';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';

import ModalSubmitClaims from '../components/ModalSubmitClaims';
interface ParentProps {
	screenProps: any;
}
export interface StateProps {
	modalVisible: boolean;
}
export interface DispatchProps {}
export interface StateProps {
	savedProjectsClaims?: IProjectsClaimsSaved[];
}

export interface Props extends DispatchProps, ParentProps {}
class HeaderSync extends React.Component<Props, StateProps> {
	state = {
		modalVisible: false,
	};

	calculateTotalSavedClams(): number {
		const projectClaims = this.props.savedProjectsClaims;
		if (projectClaims) {
			let totalClaims: number = 0;
			Object.keys(projectClaims).map(key => {
				if ('claims' in projectClaims[key]) {
					totalClaims += Object.keys(projectClaims[key].claims).length;
				}
			});
			return totalClaims;
		}
		return 0;
	}

	render() {
		const numberOfSavedClaims = this.calculateTotalSavedClams();
		return numberOfSavedClaims === 0 ? null : (
			<TouchableOpacity onPress={() => this.setState({ modalVisible: true })} style={[ContainerStyles.flexRow, HeaderSyncStyles.headerSync]}>
				<Text style={HeaderSyncStyles.claimsAmount}>{this.calculateTotalSavedClams()}</Text>
				<Icon style={HeaderSyncStyles.syncIcon} ios="ios-sync" android="md-sync" />
				<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalVisible}
					>
					<ModalSubmitClaims onSubmit={() => this.onSubmit()} onClose={() => this.setState({ modalVisible: false })} screenProps={this.props.screenProps} />
				</Modal>
			</TouchableOpacity>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		savedProjectsClaims: state.claimsStore.savedProjectsClaims
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderSync);
