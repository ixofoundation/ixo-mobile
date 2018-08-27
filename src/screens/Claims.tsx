// TODO styling needs to move to styling file
import * as React from 'react';
import moment from 'moment';
import { LinearGradient } from 'expo';
import { StatusBar, ListView, Alert, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { Container, Header, Item, Icon, Input, Content, Text, List, Button, View, Spinner, Tab, Tabs } from 'native-base';
import HeaderSync from '../components/HeaderSync';
import { IClaim, IProject } from '../models/project';
import { connect } from 'react-redux';
import Containers from '../styles/Containers';
import ClaimsStyles from '../styles/Claims';
import { ThemeColors, ClaimsButton } from '../styles/Colors';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IUser } from '../models/user';
import LightButton from '../components/LightButton';

const background = require('../../assets/backgrounds/background_2.png');
const addClaims = require('../../assets/savedclaims-visual.png');
const submittedClaims = require('../../assets/submittedclaims-visual.png');
const { height } = Dimensions.get('window');

const dummyData = [
	// TODO get correct data structure
	{
		id: '1',
		txHash: 'PROJECT NAME #1',
		submitDate: '04-09-18'
	},
	{
		id: '2',
		txHash: 'PROJECT NAME #2',
		submitDate: '04-09-18'
	},
	{
		id: '3',
		txHash: 'PROJECT NAME #3',
		submitDate: '04-09-18'
	},
	{
		id: '4',
		txHash: 'PROJECT NAME #4',
		submitDate: '04-05-18'
	}
];

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
			// headerRight: <HeaderSync />,
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
			pdsURL: '',
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

	onViewClaim(claimId: string) {
		this.props.navigation.navigate('ViewClaim', {
			claimFormKey: this.state.claimForm,
			pdsURL: this.state.pdsURL,
			projectDid: this.projectDid,
			claimId: claimId
		})
	}

	renderClaims() {
		if (this.state.claimsList) {
			return (
				<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, paddingHorizontal: '3%' }}>
					<Content>
						{this.state.claimsList.map((claim: IClaim) => {
							// console.log('claims', claim);
							return (
								<TouchableOpacity onPress={() => this.onViewClaim(claim.claimId)} key={claim.claimId}>
									<LinearGradient
										start={[0, 1]}
										colors={[ClaimsButton.colorPrimary, ClaimsButton.colorSecondary]}
										style={[ClaimsStyles.ClaimBox]}
									>
										<Text style={{ color: ThemeColors.white, fontSize: 20 }}>{`${this.projectName} ${claim.claimId.slice(claim.claimId.length-12, claim.claimId.length)}`}</Text>
										<Text style={{ color: ThemeColors.blue_lightest, fontSize: 11, paddingTop: 5 }}>Claim created {moment(claim.date).format('YYYY-MM-DD')}</Text>
									</LinearGradient>
								</TouchableOpacity>
							);
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
								<Text style={[ClaimsStyles.header, { color: ThemeColors.blue_lightest }]}>
									{this.props.screenProps.t('claims:noSubmissions')}
								</Text>
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
								<Text style={[ClaimsStyles.header, { color: ThemeColors.blue_lightest }]}>
									{this.props.screenProps.t('claims:noClaims')}
								</Text>
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
				<LightButton
					propStyles={{ backgroundColor: ThemeColors.red, borderColor: ThemeColors.red, borderRadius: 0 }}
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
