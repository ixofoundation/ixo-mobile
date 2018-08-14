// TODO styling needs to move to styling file
import * as React from 'react';
import { StatusBar, ListView, Alert, TouchableOpacity } from 'react-native';
import { Container, Header, Item, Icon, Input, Content, Text, List, Button, View, Spinner } from 'native-base';
import HeaderSync from '../components/HeaderSync';
import { IClaim, IProject } from '../models/project';
import { connect } from 'react-redux';
import Containers from '../styles/Containers';
import ClaimsStyles from '../styles/Claims';
import { ThemeColors } from '../styles/Colors';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IUser } from '../models/user';

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
	}
];

interface PropTypes {
	navigation: any;
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
	constructor(props: Props) {
		super(props);
		this.state = {
			claimsList: []
		};
	}

	onComponentDidMount() {
		this.props.ixo.project.getProjectByProjectDid(this.props.navigation.projectDid).then((project: IProject) => {
			this.setState({ claimsList: project.data.claims });
		});
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const {
			state: {
				params: { title = 'Project Name' }
			}
		} = navigation;
		return {
			headerRight: <HeaderSync />,
			title,
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
		};
	};

	renderClaims() {
		const ds = new ListView.DataSource({ rowHasChanged: (r1: any, r2: any) => r1 !== r2 });
		if (this.state.claimsList) {
			return (
				<List
					style={{ marginLeft: 6, marginRight: 6 }}
					rightOpenValue={-75}
					dataSource={ds.cloneWithRows(this.state.claimsList)}
					renderRightHiddenRow={(data, secId, rowId, rowMap) => (
						<Button
							full
							danger
							style={ClaimsStyles.DeleteButton}
							onPress={_ => {
								Alert.alert('Delete claim', 'Are you sure you want to delete the claim?', [
									{
										text: 'OK'
									},
									{ text: 'Cancel' }
								]);
							}}
						>
							<Text style={ClaimsStyles.DeleteButtonText}>Delete</Text>
						</Button>
					)}
					renderRow={(claim: IClaim) => (
						// <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails')} >
						<TouchableOpacity>
							<View style={[Containers.flexColumn, ClaimsStyles.ClaimBox]}>
								<Text style={{ color: ThemeColors.grey, fontSize: 15 }}>{claim.txHash}</Text>
								<Text style={{ color: ThemeColors.grey, fontSize: 10 }}>{claim.date}</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			);
		}
		return <Spinner color={ThemeColors.black} />;
	}

	render() {
		const {
			state: {
				params: { projectDid = '' }
			}
		} = this.props.navigation;
		return (
			<Container>
				<StatusBar barStyle="light-content" />
				<Header style={{ borderBottomWidth: 0 }}>
					<View style={[Containers.flexRow, { justifyContent: 'space-between' }]}>
						<TouchableOpacity style={[Containers.flexRow, ClaimsStyles.BadgeBoxContainer]}>
							<View style={[Containers.flexRow, ClaimsStyles.Badge]}>
								<Text style={{ color: ThemeColors.black, textAlign: 'left', padding: 5, fontSize: 13 }}>67</Text>
							</View>
							<Text style={{ color: ThemeColors.black, paddingTop: 5, paddingBottom: 5 }}> Saved</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('SubmittedClaims')}
							style={[Containers.flexRow, ClaimsStyles.BoxContainer]}
						>
							<Text style={{ color: ThemeColors.black, paddingTop: 5, paddingBottom: 5 }}>Submitted</Text>
						</TouchableOpacity>
					</View>
				</Header>
				<Header searchBar rounded style={{ borderBottomWidth: 0 }}>
					<Item>
						<Icon name="ios-search" />
						<Input placeholder="Search my claims" />
					</Item>
				</Header>
				<Content style={{ backgroundColor: ThemeColors.white }}>{this.renderClaims()}</Content>
				<TouchableOpacity onPress={() => this.props.navigation.navigate('NewClaim', { projectDid })} style={ClaimsStyles.SubmitButton}>
					<View style={Containers.flexColumn}>
						<Text style={{ color: ThemeColors.black, fontSize: 15 }}>Submit Claim</Text>
					</View>
				</TouchableOpacity>
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
