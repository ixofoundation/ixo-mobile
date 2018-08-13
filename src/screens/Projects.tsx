import React from 'react';
import { StatusBar, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
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
import { IUser } from '../models/user';

const placeholder = require('../../assets/ixo-placeholder.jpg');
const background = require('../../assets/backgrounds/background_1.jpg');

const { width, height } = Dimensions.get('window');

interface PropTypes {
	navigation: any;
}
export interface DispatchProps {
	onIxoInit: () => void;
}

export interface StateProps {
	ixo?: any;
	user?: IUser;
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
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white,
			headerLeft: (
				<Icon
					ios="ios-menu"
					onPress={() => params.drawer._root.open()}
					android="md-menu"
					style={{ paddingLeft: 10, color: ThemeColors.white }}
				/>
			),
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
			<View style={[ContainerStyles.flexRow, { justifyContent: 'flex-start', backgroundColor: 'transparent', paddingVertical: 10 }]}>
				<LinearGradient start={[0, 1]} colors={['#016480', '#03d0FE']} style={{ height: 5, width: `${approvedWidth}%`, borderRadius: 2 }} />
				<View style={[{ backgroundColor: '#E2223B', height: 5, width: `${rejectedWidth}%`, borderRadius: 2 }]} />
				<View style={[{ backgroundColor: '#033C50', height: 5, width: `${100 - approvedWidth - rejectedWidth}%`, borderRadius: 2 }]} />
			</View>
		);
	};

	fetchImage = (serviceEndpoint: string, imageLink: string) => {
		if (imageLink && imageLink !== '') {
			return { uri: `${serviceEndpoint}public/${imageLink}` };
		} else {
			return { placeholder };
		}
	};

	getProjectList() {
		if (this.props.ixo) {
			this.props.ixo.project.listProjects().then((projectList: any) => {
				let myProjects = this.getMyProjects(projectList);
				console.log(myProjects);
				this.setState({ projects: myProjects });
			});
		}
	}

	getMyProjects(projectList: any): IProject[] {
		if (this.props.user != null) {
			console.log('DID: ' + this.props.user.did);
			let myProjects = projectList.filter((projectList: any) => {
				//return projectList.data.agents.some((agent: any) => agent.did === this.props.user!.did && agent.role === 'SA');
				return projectList.data.agents;
			});
			return myProjects;
		} else {
			return [];
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
								{/* <View style={[ProjectsStyles.projectBoxStatusBar, { backgroundColor: ProjectStatus.inProgress }]} /> */}
								<View style={[ContainerStyles.flexColumn]}>
									<ImageBackground
										source={this.fetchImage(project.data.serviceEndpoint, project.data.imageLink)}
										style={[
											{
												flex: 1,
												width: '100%',
												height: height * 0.3,
												justifyContent: 'flex-end',
												flexDirection: 'row',
												paddingRight: 13
											}
										]}
									>
										<View style={{ height: 5, width: width * 0.06, backgroundColor: ProjectStatus.inProgress }} />
									</ImageBackground>
									<View style={[ContainerStyles.flexRow, ProjectsStyles.textBoxLeft]}>
										<View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
											<Text style={{ textAlign: 'left', color: ThemeColors.white, fontSize: 21, fontWeight: '500' }}>
												{project.data.title}
											</Text>
											<Text style={{ textAlign: 'left', color: ThemeColors.blue_light, fontSize: 21 }}>
												{project.data.claimStats.currentSuccessful}
												<Text style={{ textAlign: 'left', color: ThemeColors.white, fontSize: 21, fontWeight: '500' }}>
													/{project.data.requiredClaims}
												</Text>
											</Text>
											<Text style={{ textAlign: 'left', color: ThemeColors.white, fontSize: 17 }}>
												{project.data.impactAction}
											</Text>
											{this.renderProgressBar(
												project.data.requiredClaims,
												project.data.claimStats.currentSuccessful,
												project.data.claimStats.currentRejected
											)}
											<Text style={{ textAlign: 'left', color: ThemeColors.blue_lightest, fontSize: 14 }}>
												Your last claim submitted on<Text
													style={{ textAlign: 'left', color: ThemeColors.blue_lightest, fontSize: 14 }}
												>
													{' '}
													{moment(this.getLatestClaim(project.data.claims)).format('YYYY-MM-DD')}
												</Text>
											</Text>
										</View>
									</View>
								</View>
							</View>
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
				{false ? (
					<Container style={{ backgroundColor: ThemeColors.blue_dark }}>
						<StatusBar barStyle="light-content" />
						<Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
							<View style={[ProjectsStyles.flexLeft]}>
								<Text style={ProjectsStyles.header}>My projects</Text>
							</View>
						</Header>
						<Content>{this.renderProject()}</Content>
					</Container>
				) : (
					<ImageBackground source={background} style={[{ flex: 1, width: '100%', height: '100%', paddingHorizontal: 10 }]}>
						<Container>
							<StatusBar barStyle="light-content" />
							<Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
								<View style={[ProjectsStyles.flexLeft]}>
									<Text style={ProjectsStyles.header}>My projects</Text>
								</View>
							</Header>
						</Container>
					</ImageBackground>
				)}
			</Drawer>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user
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
