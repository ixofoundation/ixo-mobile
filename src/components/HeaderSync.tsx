import * as React from 'react';
import { TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Text } from 'native-base';

import ContainerStyles from '../styles/Containers';
import HeaderSyncStyles from '../styles/componentStyles/HeaderSync';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import { IClaimSaved } from '../models/project';
import { toggleClaimsSubmitted } from '../redux/dynamics/dynamics_action_creators';
import { removeClaim } from '../redux/claims/claims_action_creators';
import { getSignature } from '../utils/sovrin';
import { showToast, toastType } from '../utils/toasts';
import GenericModal from '../components/GenericModal';
interface ParentProps {
	screenProps: any;
	navigation: any | null;
}
export interface StateProps {
	modalVisible?: boolean;
	isSubmitInProgress?: boolean;
	claimsAmount?: number;
}
export interface DispatchProps {
	onRemoveClaim: (claimId: any, projectDid: string) => void;
	onClaimsSubmitted: (claimSubmitted: boolean) => void;
}
export interface StateProps {
	savedProjectsClaims?: IProjectsClaimsSaved[];
	ixo?: any;
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export interface Props extends DispatchProps, ParentProps, StateProps {}
class HeaderSync extends React.Component<Props, StateProps> {
	spinValue: Animated.Value = new Animated.Value(0);
	spin: Animated.AnimatedInterpolation = this.spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	});

	state = {
		modalVisible: false,
		claimsAmount: 0,
		isSubmitInProgress: false
	};

	toggleSpinnerAnimation = (start: boolean) => {
		if (start) {
			Animated.loop(Animated.timing(this.spinValue, { toValue: 1, duration: 4000, easing: Easing.linear })).start();
		} else {
			Animated.loop(Animated.timing(this.spinValue, { toValue: 1, duration: 4000, easing: Easing.linear })).stop();
		}
	}

	calculateTotalSavedClaims() {
		const projectClaims = this.props.savedProjectsClaims;
		if (projectClaims) {
			let totalClaims: number = 0;
			Object.keys(projectClaims).map(key => {
				// @ts-ignore
				if ('claims' in projectClaims[key]) {
					// @ts-ignore
					totalClaims += Object.keys(projectClaims[key].claims).length;
				}
			});
			return totalClaims;
		}
		return 0;
	}

	onSubmitAll = () => {
		this.setState({ isSubmitInProgress: true });
		this.toggleSpinnerAnimation(true);
		const projectClaims = this.props.savedProjectsClaims;
		const promises = [];
		if (projectClaims) {
			Object.keys(projectClaims).map((key: any) => {
				if ('claims' in projectClaims[key]) {
					// submit all claims in this found project
					promises.push(this.handleSubmitAllClaimsOfProject(projectClaims[key]));
				}
			});
			Promise.all(promises).then(() => {
				this.toggleSpinnerAnimation(false);
				this.setState({ isSubmitInProgress: false });
				this.props.onClaimsSubmitted(true);
			});
		}
	}

	handleSubmitAllClaimsOfProject(projectClaims: IProjectsClaimsSaved) {
		return new Promise((resolve, reject) => {
			try {
				const claims: any = projectClaims.claims;
				const promises = [];
				Object.keys(claims).map((key: any) => {
					promises.push(this.handleSubmitClaim(claims[key], projectClaims, JSON.parse(projectClaims.formFile)));
				});

				Promise.all(promises).then(() => {
					resolve();
				});
			} catch (exception) {
				reject();
			}
		});
	}

	handleSubmitClaim(claim: IClaimSaved, projectClaims: IProjectsClaimsSaved, formFile: any): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				const promises = [];
				formFile.fields.forEach((field: any) => {
					if (field.type === 'image') {
						if (claim.claimData[field.name] && claim.claimData[field.name].length > 0) {
							promises.push(
								this.props.ixo.project.createPublic(claim.claimData[field.name], projectClaims.pdsURL).then((res: any) => {
									// @ts-ignore
									claim.claimData[field.name] = res.result;
									return res.result;
								})
							);
						}
					}
				});
				Promise.all(promises).then(() => {
					this.handleUploadToPDS(claim.claimData, claim.claimId, projectClaims);
					resolve();
				});
			} catch (exception) {
				reject();
			}
		});
	}

	handleUploadToPDS = (claimData: any, claimId: string, projectClaims: IProjectsClaimsSaved) => {
		const claimPayload = Object.assign(claimData);
		claimPayload['projectDid'] = projectClaims.projectDid;

		getSignature(claimPayload)
			.then((signature: any) => {
				this.props.ixo.claim
					.createClaim(claimPayload, signature, projectClaims.pdsURL)
					.then(() => {
						this.props.onRemoveClaim(claimId, projectClaims.projectDid);
					})
					.catch(() => {
						showToast(this.props.screenProps.t('claims:failedSubmitClaim'), toastType.WARNING);
					});
			})
			.catch(() => {
				showToast(this.props.screenProps.t('claims:signingFailed'), toastType.DANGER);
			});
	}

	render() {
		const numberOfSavedClaims = this.calculateTotalSavedClaims();
		return numberOfSavedClaims === 0 ? null : (
			<TouchableOpacity onPress={() => { this.setState({ modalVisible: true }); }} style={[ContainerStyles.flexRow, HeaderSyncStyles.headerSync]}>
				<Text style={HeaderSyncStyles.claimsAmount}>{numberOfSavedClaims}</Text>
				<AnimatedIcon style={[HeaderSyncStyles.syncIcon, { transform: [{ rotate: this.spin }] }]} ios="ios-sync" android="md-sync" />
				<Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
					<GenericModal
						onPressButton={() => this.onSubmitAll()}
						onClose={() => { this.setState({ modalVisible: false }); }}
						paragraph={this.props.screenProps.t('claims:submitAllDiscription')}
						loading={this.state.isSubmitInProgress}
						buttonText={this.props.screenProps.t('claims:submit')}
						heading={this.props.screenProps.t('claims:submitAllClaims')}
					/>
				</Modal>
			</TouchableOpacity>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onRemoveClaim: (claimId: any, projectDid: string) => {
			dispatch(removeClaim(claimId, projectDid));
		},
		onClaimsSubmitted: (claimSubmitted: boolean) => {
			dispatch(toggleClaimsSubmitted(claimSubmitted));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderSync);
