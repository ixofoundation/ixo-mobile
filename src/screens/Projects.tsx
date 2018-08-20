import React from 'react';
import { StatusBar, TouchableOpacity, Image, ImageBackground, Dimensions, RefreshControl } from 'react-native';
import _ from 'underscore';
import { LinearGradient } from 'expo';
import { Container, Header, Item, Icon, Input, Content, View, Text, Spinner, Drawer } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import SideBar from '../components/SideBar';
import ProjectsStyles from '../styles/Projects';

import ContainerStyles from '../styles/Containers';
import { IClaim, IProject } from '../models/project';
import { ThemeColors, ProjectStatus } from '../styles/Colors';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { env } from '../../config';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IUser } from '../models/user';
import DarkButton from '../components/DarkButton';

const placeholder = require('../../assets/ixo-placeholder.jpg');
const background = require('../../assets/backgrounds/background_2.png');
const addProjects = require('../../assets/project-visual.png');
const qr = require('../../assets/qr.png');

const { width, height } = Dimensions.get('window');

interface PropTypes {
	navigation: any;
	screenProps: any;
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
	isRefreshing: boolean;
}
export interface Props extends PropTypes, DispatchProps, StateProps {}
export class Projects extends React.Component<Props, State> {

	headerTitleShown: boolean = false;

	constructor(props: Props) {
		super(props);
		this.state = {
			projects: [],
			isRefreshing: false,
		};
	}

	static navigationOptions = ({ navigation, screenProps }: { navigation: any, screenProps: any }) => {
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
			title: (params.showTitle) ? screenProps.t('projects:myProjects') : '',
			// headerTintColor: ThemeColors.white,
			headerLeft: (
				<Icon
					name="menu"
					onPress={() => params.drawer._root.open()}
					style={{ paddingLeft: 10, color: ThemeColors.white }}
				/>
			),
			// headerRight: <HeaderSync />
			headerRight: <Icon name="search" onPress={() => params.drawer._root.open()} style={{ paddingRight: 10, color: ThemeColors.white }} />
		};
	};

	componentDidMount() {
		this.props.navigation.setParams({
			// @ts-ignore
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
		// @ts-ignore
		this.drawer._root.close();
	}

	getLatestClaim(claims: IClaim[]): string {
		const myClaims: IClaim[] = claims.filter(claim => claim.saDid === this.props.user!.did);
		const claim: IClaim | undefined = _.first(_.sortBy(myClaims, (claim: IClaim) => claim.date));
		if (claim) {
			return 'Your last claim submitted on ' + moment(claim.date).format('YYYY-MM-DD');
		} else {
			return 'You have no submitted claims on this project';
		}
	}

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
				this.setState({ projects: myProjects, isRefreshing: false });
			});
		}
	}

	getMyProjects(projectList: any): IProject[] {
		if (this.props.user !== null) {
			let myProjects = projectList.filter((projectList: any) => {
				return projectList.data.agents.some((agent: any) => agent.did === this.props.user!.did && agent.role === 'SA');
			});
			return myProjects;
		} else {
			return [];
		}
	}

	updateImageLoadingStatus(project: IProject) {
		const projects = this.state.projects;
		const projectFound = _.find(projects, { projectDid: project.projectDid });
		Object.assign(projectFound, { imageLoaded: true });
		this.setState({ projects });
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

	refreshProjects() {
		this.setState({ isRefreshing: true, projects: [] });
		this.getProjectList()
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
									claimForm: project.data.templates.claim.form,
									myClaims: project.data.claims.filter(claim => claim.saDid === this.props.user!.did),
									projectDid: project.projectDid,
									title: project.data.title,
									pdsURL: project.data.serviceEndpoint
								})
							}
							key={project.projectDid}
							style={ProjectsStyles.projectBox}
						>
							<View style={ContainerStyles.flexRow}>
								<View style={[ContainerStyles.flexColumn]}>
									<ImageBackground
										onLoad={() => this.updateImageLoadingStatus(project)}
										source={this.fetchImage(project.data.serviceEndpoint, project.data.imageLink)}
										style={ProjectsStyles.projectImage}
									>
										{'imageLoaded' in project ? (
											<View style={{ height: 5, width: width * 0.06, backgroundColor: ProjectStatus.inProgress }} />
										) : (
											<View style={ProjectsStyles.spinnerCenterRow}>
												<View style={ProjectsStyles.spinnerCenterColumn}>
													<Spinner color={ThemeColors.white} />
												</View>
											</View>
										)}
									</ImageBackground>
									<View style={[ContainerStyles.flexRow, ProjectsStyles.textBoxLeft]}>
										<View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
											<Text style={ProjectsStyles.projectTitle}>{project.data.title}</Text>
											<Text style={ProjectsStyles.projectSuccessfulAmountText}>
												{project.data.claimStats.currentSuccessful}
												<Text style={ProjectsStyles.projectRequiredClaimsText}>/{project.data.requiredClaims}</Text>
											</Text>
											<Text style={ProjectsStyles.projectImpactActionText}>{project.data.impactAction}</Text>
											{this.renderProgressBar(
												project.data.requiredClaims,
												project.data.claimStats.currentSuccessful,
												project.data.claimStats.currentRejected
											)}
											<Text style={ProjectsStyles.projectLastClaimText}>
												<Text style={ProjectsStyles.projectLastClaimText}>{this.getLatestClaim(project.data.claims)}</Text>
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

	_onScroll = (event: any) => {
		const y = event.nativeEvent.contentOffset.y;
		if (y > 20 && !this.headerTitleShown) { // headerTitleShown prevents unnecessory rerendering for setParams
			this.props.navigation.setParams({
				showTitle: true
			});
			this.headerTitleShown = true;
		}
		if (y < 5 && this.headerTitleShown) {
			this.props.navigation.setParams({
				showTitle: false
			});
			this.headerTitleShown = false;
		}
	}

	renderNoProjectsView() {
		return (
			<Content
				style={{ backgroundColor: ThemeColors.blue_dark }}
				refreshControl={<RefreshControl
					refreshing={this.state.isRefreshing}
					onRefresh={() => this.refreshProjects()}
				/>}
				// @ts-ignore
				onScroll={(event) => this._onScroll(event)}
			>
				<Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
					<View style={[ProjectsStyles.flexLeft]}>
						<Text style={ProjectsStyles.header}>{this.props.screenProps.t('projects:myProjects')}</Text>
					</View>
				</Header>
				<StatusBar barStyle="light-content" />
				<Content>{this.renderProject()}</Content>
			</Content>
		);
	}

	renderProjectsView() {
		return (
			<ImageBackground source={background} style={ProjectsStyles.backgroundImage}>
				<Container>
					<Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
						<View style={[ProjectsStyles.flexLeft]}>
							<Text style={ProjectsStyles.header}>{this.props.screenProps.t('projects:myProjects')}</Text>
						</View>
					</Header>
					<StatusBar barStyle="light-content" />
					{
						(this.state.isRefreshing) ?
						<Spinner color={ThemeColors.white} />
						:
						<View>
							<View style={{ height: height * 0.4, flexDirection: 'row', justifyContent: 'center' }}>
								<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
									<Image resizeMode={'center'} source={addProjects} />
								</View>
							</View>
							<View>
								<View style={[ProjectsStyles.flexLeft]}>
									<Text style={[ProjectsStyles.header, { color: ThemeColors.blue_lightest }]}>{this.props.screenProps.t('projects:addFirstProject')}</Text>
								</View>
								<View style={{ width: '100%' }}>
									<View style={ProjectsStyles.divider} />
								</View>
								<View style={ProjectsStyles.flexLeft}>
									<Text style={ProjectsStyles.infoBox}>{this.props.screenProps.t('projects:visitIXO')}</Text>
								</View>
							</View>
						</View>
					}
				</Container>
			</ImageBackground>
		);
	}

	render() {
		return (
			<Drawer
				ref={ref => {
					// @ts-ignore
					this.drawer = ref;
				}}
				content={<SideBar navigation={this.props.navigation} />}
				onClose={() => this.closeDrawer()}
			>
				{this.state.projects.length > 0 ? (
					this.renderNoProjectsView()
				) : (
					this.renderProjectsView()
				)}
				<DarkButton iconImage={qr} text={this.props.screenProps.t('projects:scan')} onPress={() => alert('bla')} />
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
