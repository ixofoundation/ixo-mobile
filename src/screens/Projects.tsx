import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import _ from 'underscore';
import { LinearGradient } from 'expo';
import { Container, Header, Item, Icon, Input, Content, View, Text, Spinner, Drawer } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import HeaderSync from '../components/HeaderSync';
import SideBar from '../components/SideBar';
import ProjectsStyles from '../styles/Projects';

import ContainerStyles from '../styles/Containers';
import { IClaim, IProject } from '../models/project';
import { ThemeColors, ProjectStatus } from '../styles/Colors';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { env } from '../../config';
import { PublicSiteStoreState } from '../redux/public_site_reducer';

interface PropTypes {
	navigation: any;
}
export interface DispatchProps {
	onIxoInit: () => void;
}

export interface StateProps {
	ixo?: any;
}

export interface State {
	projects: IProject[];
}
export interface Props extends PropTypes, DispatchProps, StateProps {}
export class Projects extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			projects: []
		};
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const { params = {} } = navigation.state;
		return {
			headerLeft: <Icon ios="ios-menu" onPress={() => params.drawer._root.open()} android="md-menu" style={{ paddingLeft: 10 }} />,
			headerRight: <HeaderSync />
		};
	};

	componentDidMount() {
		this.props.navigation.setParams({
			drawer: this.drawer
		});
		this.props.onIxoInit();
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.ixo !== prevProps.ixo) {
			this.getProjectList();
		}
	}

	closeDrawer() {
		this.drawer._root.close();
	}

	getLatestClaim(claims: IClaim[]): Date | undefined {
		const claim: IClaim | undefined = _.first(_.sortBy(claims, (claim: IClaim) => claim.date));
		if (claim) {
			return claim.date;
		}
		return undefined;
	}

	renderProgressBar = (total: number, approved: number, rejected: number) => {
		const approvedWidth = Math.ceil((approved / total) * 100);
		const rejectedWidth = Math.ceil((rejected / total) * 100);
		return (
			<View style={[ContainerStyles.flexRow, { justifyContent: 'flex-start' }]}>
				<LinearGradient start={[0, 1]} colors={['#016480', '#03d0FE']} style={{ height: 3, width: `${approvedWidth}%` }} />
				<View style={[{ backgroundColor: '#E2223B', height: 3, width: `${rejectedWidth}%` }]} />
				<View style={[{ backgroundColor: ThemeColors.grey_sync, height: 3, width: `${100 - approvedWidth - rejectedWidth}%` }]} />
			</View>
		);
	};

	getProjectList() {
		if (this.props.ixo) {
			this.props.ixo.project.listProjects().then((projectList: any) => {
				this.setState({ projects: projectList });
				console.log(JSON.stringify(projectList));
			});
		}
	}

	renderProject() {
		// will become a mapping
		return (
			<React.Fragment>
				{this.state.projects.map((project: IProject) => {
					return (
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate('Claims', {
									projectDid: project.projectDid,
									title: project.data.title,
									pdsURL: project.data.serviceEndpoint
								})
							}
							key={project.projectDid}
							style={ProjectsStyles.projectBox}
						>
							<View style={ContainerStyles.flexRow}>
								<View style={[ProjectsStyles.projectBoxStatusBar, { backgroundColor: ProjectStatus.inProgress }]} />
								<View style={[ContainerStyles.flexColumn, { padding: 5 }]}>
									<View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
										<View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
											<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500' }}>
												{project.data.title}
											</Text>
											<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 17 }}>
												{project.data.claimStats.currentSuccessful}
												<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 17, fontWeight: '500' }}>
													/{project.data.requiredClaims}
												</Text>
											</Text>
											<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 15 }}>
												{project.data.impactAction}
											</Text>
											<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 10 }}>
												Your last claim submitted on<Text
													style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 10 }}
												>
													{' '}
													{moment(this.getLatestClaim(project.data.claims)).format('YYYY-MM-DD')}
												</Text>
											</Text>
										</View>
									</View>
								</View>
							</View>
							{this.renderProgressBar(
								project.data.requiredClaims,
								project.data.claimStats.currentSuccessful,
								project.data.claimStats.currentRejected
							)}
						</TouchableOpacity>
					);
				})}
			</React.Fragment>
		);
	}

	render() {
		return (
			<Drawer
				ref={ref => {
					this.drawer = ref;
				}}
				content={<SideBar navigation={this.props.navigation} />}
				onClose={() => this.closeDrawer()}
			>
				<Container>
					<StatusBar barStyle="light-content" />
					<Header searchBar rounded style={{ borderBottomWidth: 0 }}>
						<Item>
							<Icon name="ios-search" />
							<Input placeholder="Search my projects" />
						</Item>
					</Header>
					<Content style={{ backgroundColor: ThemeColors.white }}>
						{this.state.projects.length > 0 ? this.renderProject() : <Spinner color={ThemeColors.black} />}
					</Content>
				</Container>
			</Drawer>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onIxoInit: () => {
			dispatch(initIxo(env.REACT_APP_BLOCKCHAIN_IP, env.REACT_APP_BLOCK_SYNC_URL));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Projects);
