import React from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Text } from 'native-base';

import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import { ThemeColors } from '../styles/Colors';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';

export interface DispatchProps {}
export interface StateProps {
	savedProjectsClaims?: IProjectsClaimsSaved[];
}

export interface Props extends DispatchProps, StateProps {}
class HeaderSync extends React.Component<Props, StateProps> {
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
			<TouchableOpacity style={[ContainerStyles.flexRow, ProjectsStyles.headerSync]}>
				<Text style={{ color: ThemeColors.white, paddingRight: 5 }}>{this.calculateTotalSavedClams()}</Text>
				<Icon style={{ marginRight: 10, fontSize: 20, color: ThemeColors.white }} ios="ios-sync" android="md-sync" />
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
