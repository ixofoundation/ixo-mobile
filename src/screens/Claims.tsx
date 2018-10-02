import { Container, Content, Icon, Tab, Tabs, TabHeading, Text, View } from 'native-base';
import * as React from 'react';
import moment from 'moment';
import _ from 'underscore';
import { Dimensions, Image, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { IClaim, IProject, IClaimSaved } from '../models/project';
import { IUser } from '../models/user';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { saveForm } from '../redux/claims/claims_action_creators';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import ClaimsStyles from '../styles/Claims';
import ContainerStyles from '../styles/Containers';
import { ThemeColors, ClaimsButton } from '../styles/Colors';
import DarkButton from '../components/DarkButton';
import HeaderSync from '../components/HeaderSync';
import LinearGradient from 'react-native-linear-gradient';
import { decode as base64Decode } from 'base-64';

const background = require('../../assets/background_2.png');
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
}

export interface StateProps {
	ixo?: any;
	user?: IUser;
	project?: IProject;
	savedProjectsClaims: IProjectsClaimsSaved[];
}

export interface StateProps {
	claimForm: any;
	claimsList: IClaim[];
}

export interface Props extends ParentProps, DispatchProps, StateProps {}

const ClaimListItem = ({
	projectName,
	claimColor,
	claim,
	onViewClaim
}: {
	projectName: string;
	claimColor?: string;
	claim: IClaim | IClaimSaved;
	onViewClaim: Function;
}) => (
	<TouchableOpacity onPress={() => onViewClaim(claim.claimId)} key={claim.claimId}>
		<View style={ClaimsStyles.claimListItemContainer}>
			{claimColor && <View style={[ClaimsStyles.claimColorBlock, { backgroundColor: claimColor }]} />}
			<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[ClaimsButton.colorPrimary, ClaimsButton.colorSecondary]} style={[ClaimsStyles.ClaimBox]}>
				<Text style={ClaimsStyles.claimTitle}>{`${projectName} ${claim.claimId.slice(claim.claimId.length - 12, claim.claimId.length)}`}</Text>
				<Text style={ClaimsStyles.claimCreated}>Claim created {moment(claim.date).format('YYYY-MM-DD')}</Text>
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
	projectDid: string | undefined;
	pdsURL: string = '';
	claimsList: IClaim[] = [];
	claimForm: string = '';

	static navigationOptions = ({ navigation, screenProps }: { navigation: any, screenProps: any }) => {
		const {
			state: { params: { projectName = 'Loading...' } = {} }
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerRight: (
				<View style={ContainerStyles.flexRow}>
					<Icon name="search" onPress={() => alert('to do')} style={{ paddingRight: 10, color: ThemeColors.white }} />
					<HeaderSync screenProps={screenProps} />
				</View>
			),
			title: projectName,
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	}

	constructor(props: Props) {
		super(props);

		if (props.project) {
			this.projectDid = props.project.projectDid;
			this.projectName = props.project.data.title;
			this.pdsURL = props.project.data.serviceEndpoint;
			this.claimsList = props.project.data.claims.filter(claim => claim.saDid === this.props.user!.did);
			this.claimForm = props.project.data.templates.claim.form;
		}
	}

	componentDidMount() {
		this.fetchFormFile(this.claimForm, this.pdsURL);
		this.props.navigation.setParams({
			projectName: this.projectName
		});
	}

	onViewClaim = (claimId: string) => {
		this.props.navigation.navigate('ViewClaim', {
			claimFormKey: this.claimForm,
			pdsURL: this.pdsURL,
			projectDid: this.projectDid,
			claimId: claimId
		});
	}

	fetchFormFile = (claimFormKey: string, pdsURL: string) => {
		this.props.ixo.project
			.fetchPublic(claimFormKey, pdsURL)
			.then((res: any) => {
				let fileContents = base64Decode(res.data);
				this.props.onFormSave(fileContents, this.projectDid || '', this.pdsURL);
			})
			.catch((error: Error) => {
				console.log(error);
			});
	}

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
								projectName={this.projectName}
								claim={claim}
								claimColor={ThemeColors.orange}
								onViewClaim={this.onViewClaim}
							/>
						);
					})}
					<ClaimListItemHeading text={this.props.screenProps.t('claims:claimRejected')} icon={rejectedIcon} />
					{rejected.map((claim: IClaim) => {
						return (
							<ClaimListItem key={claim.claimId} projectName={this.projectName} claim={claim} claimColor={ThemeColors.red} onViewClaim={this.onViewClaim} />
						);
					})}
					<ClaimListItemHeading text={this.props.screenProps.t('claims:claimApproved')} icon={approvedIcon} />
					{approved.map((claim: IClaim) => {
						return (
							<ClaimListItem
								key={claim.claimId}
								projectName={this.projectName}
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
							return <ClaimListItem key={claim.claimId} projectName={this.projectName} claim={claim} onViewClaim={this.onViewClaim} />;
						})}
					</Content>
				</Container>
			);
		}
		return this.renderNoSavedClaims();
	}

	renderNoSubmittedClaims() {
		return (
			<ImageBackground source={background} style={ClaimsStyles.backgroundImage}>
				<Container>
					<View>
						<View style={{ height: height * 0.4, flexDirection: 'row', justifyContent: 'center' }}>
							<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
								<Image resizeMode={'center'} source={submittedClaims} />
							</View>
						</View>
						<View>
							<View style={[ClaimsStyles.flexLeft]}>
								<Text style={[ClaimsStyles.header, { color: ThemeColors.blue_lightest }]}>{this.props.screenProps.t('claims:noSubmissions')}</Text>
							</View>
							<View style={{ width: '100%' }}>
								<View style={ClaimsStyles.divider} />
							</View>
							<View style={ClaimsStyles.flexLeft}>
								<Text style={ClaimsStyles.infoBox}>{this.props.screenProps.t('claims:savedSubmissionsInfo')}</Text>
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
				<Container>
					<View>
						<View style={{ height: height * 0.4, flexDirection: 'row', justifyContent: 'center' }}>
							<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
								<Image resizeMode={'center'} source={addClaims} />
							</View>
						</View>
						<View>
							<View style={[ClaimsStyles.flexLeft]}>
								<Text style={[ClaimsStyles.header, { color: ThemeColors.blue_lightest }]}>{this.props.screenProps.t('claims:noClaims')}</Text>
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

	render() {
		const projectClaims: IProjectsClaimsSaved = this.props.savedProjectsClaims[this.projectDid];
		const numberOfSavedClaims: number = projectClaims && projectClaims.claims ? Object.keys(projectClaims.claims).length : 0;
		return (
			<Container style={{ backgroundColor: ThemeColors.blue_dark }}>
				<StatusBar barStyle="light-content" />
				<Tabs tabBarUnderlineStyle={{ borderWidth: 1 }} tabContainerStyle={{ borderBottomColor: ThemeColors.blue_light }}>
					<Tab heading={this.renderSavedTab(numberOfSavedClaims)}>{this.renderSavedClaims(projectClaims)}</Tab>
					<Tab heading={this.props.screenProps.t('claims:submitted')}>{this.renderSubmittedClaims()}</Tab>
				</Tabs>
				<DarkButton onPress={() => this.props.navigation.navigate('NewClaim')} text={this.props.screenProps.t('claims:submitButton')} />
			</Container>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onFormSave: (claimForm: any, projectDid: string, pdsURL: string) => {
			dispatch(saveForm(claimForm, projectDid, pdsURL));
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user,
		project: state.projectsStore.selectedProject,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Claims);
