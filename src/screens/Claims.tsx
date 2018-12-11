import { Container, Content, Tab, Tabs, TabHeading, Text, View } from 'native-base';
import * as React from 'react';
import moment from 'moment';
import _ from 'underscore';
import { Image, ImageBackground, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { IClaim, IProject, IClaimSaved, IProjectSaved } from '../models/project';
import { IUser } from '../models/user';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { saveForm, loadSavedClaim, loadSubmittedClaim } from '../redux/claims/claims_action_creators';
import { toggleClaimsSubmitted } from '../redux/dynamics/dynamics_action_creators';
import { userFirstClaim } from '../redux/user/user_action_creators';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import LinearGradient from 'react-native-linear-gradient';
import { decode as base64Decode } from 'base-64';

import ClaimsStyles from '../styles/Claims';
import ContainerStyles from '../styles/Containers';
import SubmittedClaimsStyles from '../styles/SubmittedClaims';
import { ThemeColors, ClaimsButton } from '../styles/Colors';
import DarkButton from '../components/DarkButton';
import HeaderSync from '../components/HeaderSync';
import { showToast, toastType } from '../utils/toasts';
import LightButton from '../components/LightButton';
import Banner from '../components/Banner';
import CustomIcons from '../components/svg/CustomIcons';

const background = require('../../assets/background_2.png');
const backgroundSuccess = require('../../assets/background_1.png');
const addClaims = require('../../assets/savedclaims-visual.png');
const submittedClaims = require('../../assets/submittedclaims-visual.png');
const approvedIcon = require('../../assets/icon-approved.png');
const rejectedIcon = require('../../assets/icon-rejected.png');
const pendingIcon = require('../../assets/icon-pending.png');

const { height } = Dimensions.get('window');

enum ClaimStatus {
	Pending = '0',
	Approved = '1',
	Rejected = '2'
}
interface ParentProps {
	navigation: any;
	screenProps: any;
}

export interface DispatchProps {
	onFormSave: (claimForm: any, projectDID: string, pdsURL: string) => void;
	onLoadSavedClaim: (claimId: string) => void;
	onLoadSubmittedClaim: (claimId: string) => void;
	onClaimsSubmitted: (claimsSubmitted: boolean) => void;
}

export interface StateProps {
	ixo?: any;
	firstTimeClaim?: boolean;
	user?: IUser;
	project?: IProject;
	projectsLocalStates?: IProjectSaved[];
	savedProjectsClaims: IProjectsClaimsSaved[];
	online?: boolean;
	isClaimsSubmitted?: boolean;
}

export interface StateProps {
	claimForm: any;
	claimsList: IClaim[];
}

export interface Props extends ParentProps, DispatchProps, StateProps {}

const ClaimListItem = ({
	impactAction,
	claimColor,
	claim,
	onViewClaim,
	savedClaim,
	screenProps
}: {
	impactAction: string;
	claimColor?: string;
	claim: IClaim | IClaimSaved;
	onViewClaim: Function;
	savedClaim: boolean;
	screenProps: string;
}) => (
	<TouchableOpacity onPress={() => onViewClaim(claim.claimId, savedClaim)} key={claim.claimId}>
		<View style={ClaimsStyles.claimListItemContainer}>
			{claimColor && <View style={[ClaimsStyles.claimColorBlock, { backgroundColor: claimColor }]} />}
			<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[ClaimsButton.colorPrimary, ClaimsButton.colorSecondary]} style={[ClaimsStyles.ClaimBox]}>
				<Text style={ClaimsStyles.claimTitle}>{`${impactAction} ${claim.claimId.slice(claim.claimId.length - 12, claim.claimId.length)}`}</Text>
				<Text style={ClaimsStyles.claimCreated}>
					{screenProps} {moment(claim.date).format('YYYY-MM-DD')}
				</Text>
			</LinearGradient>
		</View>
	</TouchableOpacity>
);

const ClaimListItemHeading = ({ text, icon }: { text: string; icon: any }) => (
	<View style={ClaimsStyles.claimHeadingContainer}>
		<Image resizeMode={'contain'} style={ClaimsStyles.claimStatusIcons} source={icon} />
		<Text style={ClaimsStyles.claimHeadingText}>{text}</Text>
	</View>
);

class Claims extends React.Component<Props, StateProps> {
	projectName: string = '';
	impactAction: string = '';
	projectDid: string | undefined;
	pdsURL: string = '';
	claimsList: IClaim[] = [];
	claimForm: string = '';

	static navigationOptions = ({ navigation, screenProps }: { navigation: any; screenProps: any }) => {
		const {
			state: { params: { projectName = 'Loading...' } = {} }
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark,
				elevation: 0
			},
			headerRight: (
				<View style={ContainerStyles.flexRow}>
					{/* <CustomIcon name="search" style={{ paddingRight: 10, color: ThemeColors.white }} size={height * 0.03} /> */}
					<HeaderSync navigation={navigation} screenProps={screenProps} />
				</View>
			),
			title: projectName.length > 18 ? `${projectName.substring(0, 14)}...` : projectName,
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	};

	constructor(props: Props) {
		super(props);

		if (props.project) {
			this.projectDid = props.project.projectDid;
			this.projectName = props.project.data.title;
			this.impactAction = props.project.data.impactAction;
			this.pdsURL = props.project.data.serviceEndpoint;
			this.claimsList = props.project.data.claims.filter(claim => claim.saDid === this.props.user!.did);
			this.claimForm = props.project.data.templates.claim.form;
		}
	}

	componentDidMount() {
		this.props.onClaimsSubmitted(false);
		this.fetchFormFile(this.claimForm, this.pdsURL);
		this.props.navigation.setParams({
			projectName: this.projectName
		});
	}

	onViewClaim = (claimId: string, saved: boolean) => {
		if (saved) {
			this.props.onLoadSavedClaim(claimId);
			this.props.navigation.navigate('ViewClaim', { editable: true });
		} else {
			if (this.props.online) {
				this.props.onLoadSubmittedClaim(claimId);
				this.props.navigation.navigate('ViewClaim', { editable: false });
			} else {
				showToast(this.props.screenProps.t('claims:noInternet'), toastType.WARNING);
			}
		}
	};

	fetchFormFile = (claimFormKey: string, pdsURL: string) => {
		this.props.ixo.project
			.fetchPublic(claimFormKey, pdsURL)
			.then((res: any) => {
				const fileContents = base64Decode(res.data);
				this.props.onFormSave(fileContents, this.projectDid || '', this.pdsURL);
			})
			.catch((error: Error) => {
				console.log(error);
			});
	};

	renderSubmittedClaims() {
		if (_.isEmpty(this.claimsList)) {
			return this.renderNoSubmittedClaims();
		}
		const groups = _.groupBy(this.claimsList, 'status');
		const pending = groups[ClaimStatus.Pending] || [];
		const approved = groups[ClaimStatus.Approved] || [];
		const rejected = groups[ClaimStatus.Rejected] || [];
		return (
			<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, paddingHorizontal: '3%' }}>
				<Content>
					<ClaimListItemHeading text={this.props.screenProps.t('claims:claimPending')} icon={pendingIcon} />
					{pending.map((claim: IClaim) => {
						return (
							<ClaimListItem
								key={claim.claimId}
								savedClaim={false}
								impactAction={this.impactAction}
								claim={claim}
								claimColor={ThemeColors.orange}
								onViewClaim={this.onViewClaim}
								screenProps={this.props.screenProps.t('claims:claimSubmitted')}
							/>
						);
					})}
					<ClaimListItemHeading text={this.props.screenProps.t('claims:claimRejected')} icon={rejectedIcon} />
					{rejected.map((claim: IClaim) => {
						return (
							<ClaimListItem
								key={claim.claimId}
								savedClaim={false}
								impactAction={this.impactAction}
								claim={claim}
								claimColor={ThemeColors.red}
								onViewClaim={this.onViewClaim}
								screenProps={this.props.screenProps.t('claims:claimSubmitted')}
							/>
						);
					})}
					<ClaimListItemHeading text={this.props.screenProps.t('claims:claimApproved')} icon={approvedIcon} />
					{approved.map((claim: IClaim) => {
						return (
							<ClaimListItem
								key={claim.claimId}
								screenProps={this.props.screenProps.t('claims:claimSubmitted')}
								savedClaim={false}
								impactAction={this.impactAction}
								claim={claim}
								claimColor={ThemeColors.green}
								onViewClaim={this.onViewClaim}
							/>
						);
					})}
				</Content>
			</Container>
		);
	}

	renderSavedClaims(projectClaims: any) {
		if (projectClaims && projectClaims.claims && Object.keys(projectClaims.claims).length !== 0) {
			return (
				<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, paddingHorizontal: '3%' }}>
					<Content>
						{Object.keys(projectClaims.claims).map(key => {
							const claim: IClaimSaved = projectClaims.claims[key];
							return (
								<ClaimListItem
									screenProps={claim.updated ? this.props.screenProps.t('claims:claimUpdated') : this.props.screenProps.t('claims:claimCreated')}
									key={claim.claimId}
									savedClaim={true}
									impactAction={this.impactAction}
									claim={claim}
									onViewClaim={this.onViewClaim}
								/>
							);
						})}
					</Content>
				</Container>
			);
		}
		return this.renderNoSavedClaims();
	}

	renderNoSubmittedClaims() {
		let hasCapabilities = true;
		const localProjectState = this.props.projectsLocalStates.find((projectLocal: IProjectSaved) => projectLocal.projectDid === this.projectDid);
		hasCapabilities = (localProjectState && localProjectState.userHasCapabilities) ? true : false ;
		return (
			<ImageBackground source={background} style={ClaimsStyles.backgroundImage}>
				<Container style={{ paddingHorizontal: 30 }}>
					<View>
						<View style={ClaimsStyles.imageContainer}>
							<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
								<Image resizeMode={'stretch'} source={submittedClaims} />
							</View>
						</View>
						<View>
							<View style={[ClaimsStyles.flexLeft]}>
								<Text style={[ClaimsStyles.header]}>
									{hasCapabilities
										? this.props.screenProps.t('claims:noSubmissions')
										: this.props.screenProps.t('claims:applicationPendingApproval')}
								</Text>
							</View>
							<View style={{ width: '100%' }}>
								<View style={ClaimsStyles.divider} />
							</View>
							<View style={ClaimsStyles.flexLeft}>
								<Text style={ClaimsStyles.infoBox}>
									{hasCapabilities
										? this.props.screenProps.t('claims:savedSubmissionsInfo')
										: this.props.screenProps.t('claims:pleaseCheckBackSoon')}
								</Text>
							</View>
						</View>
					</View>
				</Container>
			</ImageBackground>
		);
	}

	renderNoSavedClaims() {
		return (
			<ImageBackground source={background} style={ClaimsStyles.backgroundImage}>
				<Container style={{ paddingHorizontal: 30 }}>
					<View>
						<View style={ClaimsStyles.imageContainer}>
							<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
								<Image resizeMode={'stretch'} source={addClaims} />
							</View>
						</View>
						<View>
							<View style={[ClaimsStyles.flexLeft]}>
								<Text style={[ClaimsStyles.header]}>{this.props.screenProps.t('claims:noClaims')}</Text>
							</View>
							<View style={{ width: '100%' }}>
								<View style={ClaimsStyles.divider} />
							</View>
							<View style={ClaimsStyles.flexLeft}>
								<Text style={ClaimsStyles.infoBox}>{this.props.screenProps.t('claims:saveClaimsOffline')}</Text>
							</View>
						</View>
					</View>
				</Container>
			</ImageBackground>
		);
	}

	renderSavedTab(numberOfSavedClaims: number) {
		if (numberOfSavedClaims === 0) {
			return this.props.screenProps.t('claims:saved');
		}
		return (
			<TabHeading>
				<View style={ClaimsStyles.tabCounterContainer}>
					<Text style={ClaimsStyles.tabCounterText}>{numberOfSavedClaims}</Text>
				</View>
				<Text>{this.props.screenProps.t('claims:saved')}</Text>
			</TabHeading>
		);
	}

	renderAllSavedClaimsSubmitted() {
		return (
			<ImageBackground source={backgroundSuccess} style={ClaimsStyles.backgroundImage}>
				<View style={SubmittedClaimsStyles.wrapper}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 0.2 }}>
							<View style={[SubmittedClaimsStyles.iconWrapper, { backgroundColor: ThemeColors.success_green }]}>
								<CustomIcons style={{ color: ThemeColors.white }} name="approved" size={height * 0.05} />
							</View>
						</View>
						<View style={SubmittedClaimsStyles.textWrapper}>
							<View style={[SubmittedClaimsStyles.flexLeft]}>
								<Text style={[SubmittedClaimsStyles.header, { color: ThemeColors.white }]}>
									{this.props.screenProps.t('submittedClaims:successMessageMultiple')}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</ImageBackground>
		);
	}

	renderConnectivity() {
		if (this.props.online) return null;
		return <Banner text={this.props.screenProps.t('dynamics:offlineMode')} />;
	}

	render() {
		const projectClaims: IProjectsClaimsSaved = this.props.savedProjectsClaims[this.projectDid];
		const numberOfSavedClaims: number = projectClaims && projectClaims.claims ? Object.keys(projectClaims.claims).length : 0;
		return (
			<Container>
				{this.renderConnectivity()}
				<StatusBar barStyle="light-content" />
				<Tabs
					style={{ backgroundColor: ThemeColors.blue_dark }}
					tabBarUnderlineStyle={{ backgroundColor: ThemeColors.blue_lightest, height: 1 }}
					tabContainerStyle={{ borderBottomColor: ThemeColors.blue, elevation: 0, borderBottomWidth: 1 }}
				>
					<Tab
						activeTabStyle={{ backgroundColor: ThemeColors.blue_dark }}
						tabStyle={{ backgroundColor: ThemeColors.blue_dark }}
						heading={this.renderSavedTab(numberOfSavedClaims)}
					>
						{this.props.isClaimsSubmitted ? this.renderAllSavedClaimsSubmitted() : this.renderSavedClaims(projectClaims)}
					</Tab>
					<Tab
						activeTabStyle={{ backgroundColor: ThemeColors.blue_dark }}
						tabStyle={{ backgroundColor: ThemeColors.blue_dark }}
						heading={this.props.screenProps.t('claims:submitted')}
					>
						{this.renderSubmittedClaims()}
					</Tab>
				</Tabs>
				{this.props.firstTimeClaim ? (
					<LightButton
						propStyles={{ backgroundColor: ThemeColors.red, borderColor: ThemeColors.red, borderRadius: 0 }}
						onPress={() => {
							this.props.navigation.navigate('NewClaim');
						}}
						text={this.props.screenProps.t('claims:submitButton')}
					/>
				) : (
					<DarkButton onPress={() => this.props.navigation.navigate('NewClaim')} text={this.props.screenProps.t('claims:submitButton')} />
				)}
			</Container>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onFormSave: (claimForm: any, projectDid: string, pdsURL: string) => {
			dispatch(saveForm(claimForm, projectDid, pdsURL));
		},
		onLoadSavedClaim: (claimId: string) => {
			dispatch(loadSavedClaim(claimId));
		},
		onLoadSubmittedClaim: (claimId: string) => {
			dispatch(loadSubmittedClaim(claimId));
		},
		onClaimsSubmitted: (claimsSubmitted: boolean) => {
			dispatch(toggleClaimsSubmitted(claimsSubmitted));
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user,
		firstTimeClaim: state.userStore.isFirstClaim,
		project: state.projectsStore.selectedProject,
		projectsLocalStates: state.projectsStore.projectsLocalStates,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims,
		online: state.dynamicsStore.online,
		isClaimsSubmitted: state.dynamicsStore.claimsSubmitted
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Claims);
