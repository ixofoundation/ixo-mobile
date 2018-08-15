// TODO styling needs to move to styling file
import * as React from 'react';
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
		address: 'sldkce2322kjsdlckd230092',
		submitDate: '04-09-18'
	},
	{
		id: '2',
		address: 'cd32de2322kjsdlckd24f292',
		submitDate: '04-09-18'
	},
	{
		id: '3',
		address: 'fddkce2322kjsdl1dws30092',
		submitDate: '04-09-18'
	},
	{
		id: '4',
		address: 'fasdfasddkce2322kjsdl1dws30092',
		submitDate: '04-05-18'
	}
];

interface PropTypes {
	navigation: any;
	screenProps: any;
}
interface State {
	claimsList: IClaim[];
}
export interface StateProps {
	ixo?: any;
	user?: IUser;
}

export interface Props extends PropTypes, StateProps {}

class Claims extends React.Component<Props, State> {
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
	}

	constructor(props: Props) {
		super(props);
		this.state = {
			claimsList: []
		};
	}

	componentDidMount() {
		if (this.props.navigation.state.params.myClaims) {
			this.setState({ claimsList: this.props.navigation.state.params.myClaims });
		}
	}

	renderClaims() {
		if (this.state.claimsList) {

			return (
				<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, paddingHorizontal: '3%' }}>
				 {this.state.claimsList.map((claim: IClaim) => {
						 return (
							<TouchableOpacity key={claim.txHash}>
								<LinearGradient start={[0, 1]} colors={[ClaimsButton.colorPrimary, ClaimsButton.colorSecondary]} style={[ ClaimsStyles.ClaimBox]}>
									<Text style={{ color: ThemeColors.white, fontSize: 20 }}>{claim.txHash}</Text>
									<Text style={{ color: ThemeColors.blue_lightest, fontSize: 15, paddingTop: 5 }}>Claim created {claim.date}</Text>
								</ LinearGradient>
							</TouchableOpacity>
						 );
					})
				}
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
		const {
			state: {
				params: { projectDid = '', title }
			}
		} = this.props.navigation;
		return (
			<Container style={{ backgroundColor: ThemeColors.blue_dark }}>
				<StatusBar barStyle="light-content" />
				<Tabs tabBarUnderlineStyle={{ borderWidth: 1 }} tabContainerStyle={{ borderBottomColor: ThemeColors.blue_dark }} >
					<Tab heading={this.props.screenProps.t('claims:saved')}>
						{(this.state.claimsList.length > 0) ? this.renderClaims() : this.renderNoSavedClaims()}
					</Tab>
					<Tab heading={this.props.screenProps.t('claims:submitted')}>
						{this.renderNoSubmittedClaims()}
					</Tab>
				</Tabs>
				<LightButton propStyles={{ backgroundColor: ThemeColors.red, borderColor: ThemeColors.red, borderRadius: 0 }} onPress={() => this.props.navigation.navigate('NewClaim', { projectDid, title })} text={this.props.screenProps.t('claims:submitButton')} />
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
