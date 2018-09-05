import { Container, Content, Icon, Spinner, Tab, Tabs, Text, View } from 'native-base';
import * as React from 'react';
import moment from 'moment';
import _ from 'underscore';
import { Dimensions, Image, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { IClaim } from '../models/project';
import { IUser } from '../models/user';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import ClaimsStyles from '../styles/Claims';
import { ThemeColors, ClaimsButton } from '../styles/Colors';
import DarkButton from '../components/DarkButton';
import { LinearGradient } from 'expo';

const background = require('../../assets/backgrounds/background_2.png');
const addClaims = require('../../assets/savedclaims-visual.png');
const submittedClaims = require('../../assets/submittedclaims-visual.png');
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
interface State {
	claimsList: IClaim[];
	claimForm: any;
	pdsURL: string;
}
export interface StateProps {
	ixo?: any;
	user?: IUser;
}

export interface Props extends ParentProps, StateProps {}

const ClaimListItem = ({ projectName, claimColor, claim, onViewClaim }: { projectName: string, claimColor: string, claim: IClaim, onViewClaim: Function }) => (
	<TouchableOpacity onPress={() => onViewClaim(claim.claimId)} key={claim.claimId}>
		<View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, alignItems: 'center' }}>
			<View style={{ backgroundColor: claimColor, width: 5, height: '40%' }} />
			<LinearGradient start={[0, 1]} colors={[ClaimsButton.colorPrimary, ClaimsButton.colorSecondary]} style={[ClaimsStyles.ClaimBox]}>
				<Text style={{ color: ThemeColors.white, fontSize: 20 }}>{`${projectName} ${claim.claimId.slice(
					claim.claimId.length - 12,
					claim.claimId.length
				)}`}</Text>
				<Text style={{ color: ThemeColors.blue_lightest, fontSize: 11, paddingTop: 5 }}>
					Claim created {moment(claim.date).format('YYYY-MM-DD')}
				</Text>
			</LinearGradient>
		</View>
	</TouchableOpacity>
);

class Claims extends React.Component<Props, State> {
	projectName: string = '';
	projectDid: string | undefined;

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const {
			state: {
				params: { title = 'Project Name' }
			}
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerRight: <Icon name="search" onPress={() => alert('todo')} style={{ paddingRight: 10, color: ThemeColors.white }} />,
			title,
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
		this.state = {
			claimsList: [],
			claimForm: null,
			pdsURL: ''
		};

		const {
			state: {
				params: { projectDid = '', title }
			}
		} = this.props.navigation;
		this.projectDid = projectDid;
	}

	componentDidMount() {
		let componentProps: any = this.props.navigation.state.params;
		this.projectName = this.props.navigation.state.params.title;
		if (componentProps) {
			this.setState({ claimsList: componentProps.myClaims, claimForm: componentProps.claimForm, pdsURL: componentProps.pdsURL });
		}
	}

	onViewClaim = (claimId: string) => {
		this.props.navigation.navigate('ViewClaim', {
			claimFormKey: this.state.claimForm,
			pdsURL: this.state.pdsURL,
			projectDid: this.projectDid,
			claimId: claimId
		});
	}

	renderClaims() {
		if (this.state.claimsList) {
			const groups = _.groupBy(this.state.claimsList, 'status');
			const pending = groups[ClaimStatus.Pending] || [];
			const approved = groups[ClaimStatus.Approved] || [];
			const rejected = groups[ClaimStatus.Rejected] || [];
			// debugger;
			return (
				<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, paddingHorizontal: '3%' }}>
					<Content>
						<View>
							<Text style={{ fontFamily: 'Roboto_condensed', color: ThemeColors.white, marginVertical: height * 0.04 }}>CLAIMS PENDING APPROVAL</Text>
						</View>
						{pending.map((claim: IClaim) => {
							return <ClaimListItem key={claim.claimId} projectName={this.projectName} claim={claim} claimColor={ThemeColors.orange} onViewClaim={this.onViewClaim} />
						})}
						<View>
							<Text style={{ fontFamily: 'Roboto_condensed', color: ThemeColors.white, marginVertical: height * 0.04 }}>CLAIMS REJECTED</Text>
						</View>
						{rejected.map((claim: IClaim) => {
							return <ClaimListItem key={claim.claimId} projectName={this.projectName} claim={claim} claimColor={ThemeColors.red} onViewClaim={this.onViewClaim} />
						})}
						<View>
							<Text style={{ fontFamily: 'Roboto_condensed', color: ThemeColors.white, marginVertical: height * 0.04 }}>CLAIMS APPROVED</Text>
						</View>
						{approved.map((claim: IClaim) => {
							return <ClaimListItem key={claim.claimId} projectName={this.projectName} claim={claim} claimColor={ThemeColors.green} onViewClaim={this.onViewClaim} />
						})}
					</Content>
				</Container>
			);
		}
		return <Spinner color={ThemeColors.black} />;
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

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.blue_dark }}>
				<StatusBar barStyle="light-content" />
				<Tabs tabBarUnderlineStyle={{ borderWidth: 1 }} tabContainerStyle={{ borderBottomColor: ThemeColors.blue_dark }}>
					<Tab heading={this.props.screenProps.t('claims:saved')}>
						{/* {this.state.claimsList.length > 0 ? this.renderClaims() : this.renderNoSavedClaims()} */}
						{this.renderClaims()}
					</Tab>
					<Tab heading={this.props.screenProps.t('claims:submitted')}>{this.renderNoSubmittedClaims()}</Tab>
				</Tabs>
				<DarkButton
					// propStyles={{ backgroundColor: ThemeColors.red, borderColor: ThemeColors.red, borderRadius: 0 }}
					onPress={() =>
						this.props.navigation.navigate('NewClaim', {
							claimForm: this.state.claimForm,
							pdsURL: this.state.pdsURL,
							projectDid: this.projectDid
						})
					}
					text={this.props.screenProps.t('claims:submitButton')}
				/>
			</Container>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user
	};
}

export default connect(mapStateToProps)(Claims);
