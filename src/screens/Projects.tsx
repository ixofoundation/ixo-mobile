import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { showToast, toastType } from '../utils/toasts';
import { setLocalProjectImage, getLocalProjectImage } from '../utils/localCache';
import IxoHelper from '../utils/ixoHelper';
import { SDGArray } from '../models/sdg';
import { Container, Content, Drawer, Header, Text, View, Fab } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, ImageBackground, RefreshControl, StatusBar, TouchableOpacity, ActivityIndicator, YellowBox, ImageStore, ImageEditor } from 'react-native';
import { connect } from 'react-redux';
import _ from 'underscore';
import { env } from '../config';
import SideBar from '../components/SideBar';
import { IClaim, IProject, IProjectSaved } from '../models/project';
import { IUser } from '../models/user';
import { initIxo } from '../redux/ixo/ixo_action_creators';
import { updateProjects, loadProject } from '../redux/projects/projects_action_creators';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import { ThemeColors, ProjectStatus, ClaimsButton, ProgressSuccess } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import HeaderSync from '../components/HeaderSync';
import Banner from '../components/Banner';
import CustomIcon from '../components/svg/CustomIcons';

YellowBox.ignoreWarnings(['ForwardRef']);

const placeholder = require('../../assets/ixo-placeholder.jpg');
const background = require('../../assets/background_2.png');
const addProjects = require('../../assets/project-visual.png');
const qr = require('../../assets/qr.png');

const { width, height } = Dimensions.get('window');

interface ParentProps {
	navigation: any;
	screenProps: any;
}
export interface DispatchProps {
	onIxoInit: () => void;
	onProjectsUpdate: (project: IProject[]) => void;
	onProjectSelect: (project: IProject) => void;
}

export interface StateProps {
	ixo?: any;
	user?: IUser;
	savedProjectsClaims?: IProjectsClaimsSaved[];
	online?: boolean;
	projects?: IProject[];
	projectsLocalStates?: IProjectSaved[];
}

export interface StateProps {
	isRefreshing: boolean;
	isDrawerOpen: boolean;
}

export interface Props extends ParentProps, DispatchProps, StateProps {}
export class Projects extends React.Component<Props, StateProps> {
	headerTitleShown: boolean = false;
	ixoHelper: IxoHelper = new IxoHelper();

	state = {
		isRefreshing: false,
		isDrawerOpen: false
	};

	static navigationOptions = ({ navigation, screenProps }: { navigation: any; screenProps: any }) => {
		const { params = {} } = navigation.state;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark,
				elevation: 0
			},
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			title: params.showTitle ? screenProps.t('projects:myProjects') : '',
			headerLeft: <CustomIcon name="menu" onPress={() => params.openDrawer()} style={{ paddingLeft: 10, color: ThemeColors.white }} size={height * 0.03} />,
			headerRight: (
				<View style={ContainerStyles.flexRow}>
					{/* <CustomIcon name="search" style={{ paddingRight: 10, color: ThemeColors.white }} size={height * 0.03} /> */}
					<HeaderSync navigation={null} screenProps={screenProps} />
				</View>
			)
		};
	};

	componentDidMount() {
		this.props.navigation.setParams({
			// @ts-ignore
			openDrawer: this.openDrawer,
			savedProjectsClaims: this.props.savedProjectsClaims
		});
		this.props.onIxoInit();
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.ixo !== prevProps.ixo || this.props.online !== prevProps.online) {
			this.ixoHelper.updateMyProjects();
		}
	}

	openDrawer = () => {
		// @ts-ignore
		this.props.navigation.openDrawer();
		this.setState({ isDrawerOpen: true });
	};

	closeDrawer = () => {
		// @ts-ignore
		this.props.navigation.closeDrawer();
		this.setState({ isDrawerOpen: false });
	};

	getLatestClaim(claims: IClaim[]): string {
		const myClaims: IClaim[] = claims.filter(claim => claim.saDid === this.props.user!.did);
		const claim: IClaim | undefined = _.first(_.sortBy(myClaims, (claim: IClaim) => claim.date));
		if (claim) {
			return 'Your last claim submitted on ' + moment(claim.date).format('YYYY-MM-DD');
		} else {
			return 'You have no submitted claims on this project';
		}
	}

	fetchImage = (project: IProject, localProjectState: IProjectSaved) => {
		if (this.props.online && !localProjectState) {
			// only fetch new images when online
			if (project.data.imageLink && project.data.imageLink !== '') {
				setLocalProjectImage(project.projectDid, `${project.data.serviceEndpoint}public/${project.data.imageLink}`);
				return { uri: `${project.data.serviceEndpoint}public/${project.data.imageLink}` };
			} else {
				return placeholder;
			}
		} else {
			return { uri: getLocalProjectImage(project.projectDid) };
		}
	};

	renderProgressBar = (total: number, approved: number, rejected: number) => {
		if (rejected > total - approved) {
			rejected = total - approved;
		}
		const approvedWidth = Math.ceil((approved / total) * 100);
		const rejectedWidth = Math.ceil((rejected / total) * 100);
		return (
			<View style={[ContainerStyles.flexRow, ProjectsStyles.progressBarContainer]}>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					colors={[ProgressSuccess.colorPrimary, ProgressSuccess.colorSecondary]}
					style={{ height: 5, width: `${approvedWidth}%`, borderRadius: 2 }}
				/>
				<View
					style={[
						{
							backgroundColor: ThemeColors.progressRed,
							height: 5,
							width: `${rejectedWidth}%`,
							borderRadius: 2,
							borderTopLeftRadius: 0,
							borderBottomLeftRadius: 0
						}
					]}
				/>
				<View style={[{ backgroundColor: ThemeColors.progressNotCounted, height: 5, width: `${100 - approvedWidth - rejectedWidth}%`, borderRadius: 2 }]} />
			</View>
		);
	};

	renderProjectImage(project: IProject) {
		const localProjectState = this.props.projectsLocalStates.find((projectLocal: IProjectSaved) => projectLocal.projectDid === project.projectDid);
		return (
			<ImageBackground source={this.fetchImage(project, localProjectState)} style={ProjectsStyles.projectImage}>
				{localProjectState ? (
					<View style={{ marginRight: 20 }}>
						<View style={ProjectsStyles.projectStatusContainer}>
							<View style={[ProjectsStyles.statusBlock, { backgroundColor: ProjectStatus.inProgress }]} />
						</View>
						<View style={ProjectsStyles.projectSDGContainer}>
							{project.data.sdgs.map((SDG, SDGi) => {
								return (
									<CustomIcon
										key={SDGi}
										name={`sdg-${SDGArray[Math.floor(SDG) - 1].ico}`}
										style={{ color: ThemeColors.white, padding: 5 }}
										size={height * 0.03}
									/>
								);
							})}
						</View>
					</View>
				) : (
					<View style={ProjectsStyles.spinnerCenterRow}>
						<View style={ProjectsStyles.spinnerCenterColumn}>
							<ActivityIndicator color={ThemeColors.white} />
						</View>
					</View>
				)}
			</ImageBackground>
		);
	}

	renderProject() {
		// will become a mapping
		return (
			<React.Fragment>
				{this.props.projects.map((project: IProject) => {
					return (
						<TouchableOpacity
							onPress={() => {
								this.props.onProjectSelect(project);
								this.props.navigation.navigate('Claims');
							}}
							key={project.projectDid}
							style={ProjectsStyles.projectBox}
						>
							<View style={ContainerStyles.flexRow}>
								<View style={[ContainerStyles.flexColumn]}>
									{this.renderProjectImage(project)}
									<LinearGradient
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 0 }}
										colors={[ClaimsButton.colorPrimary, ClaimsButton.colorSecondary]}
										style={[ContainerStyles.flexRow, ProjectsStyles.textBoxLeft]}
									>
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
									</LinearGradient>
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
		if (y > 20 && !this.headerTitleShown) {
			// headerTitleShown prevents unnecessory rerendering for setParams
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
	};

	renderNoProjectsView() {
		return (
			<Content
				style={{ backgroundColor: ThemeColors.blue_dark }}
				refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={() => this.ixoHelper.updateMyProjects()} />}
				// @ts-ignore
				onScroll={event => this._onScroll(event)}
			>
				<Header noShadow style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
					<View style={[ProjectsStyles.flexLeft]}>
						<Text style={ProjectsStyles.myProjectsHeader}>{this.props.screenProps.t('projects:myProjects')}</Text>
					</View>
				</Header>
				<StatusBar backgroundColor={ThemeColors.blue_dark} barStyle="light-content" />
				<Content>{this.renderProject()}</Content>
			</Content>
		);
	}

	renderProjectsView() {
		return (
			<ImageBackground source={background} style={ProjectsStyles.backgroundImage}>
				<Container>
					<Header style={{ borderBottomWidth: 0, backgroundColor: 'transparent', elevation: 0 }}>
						<View style={[ProjectsStyles.flexLeft]}>
							<Text style={ProjectsStyles.myProjectsHeader}>{this.props.screenProps.t('projects:myProjects')}</Text>
						</View>
					</Header>
					<StatusBar backgroundColor={ThemeColors.blue_dark} barStyle="light-content" />
					{this.state.isRefreshing ? (
						<ActivityIndicator color={ThemeColors.white} />
					) : (
						<View>
							<View style={{ height: height * 0.4, flexDirection: 'row', justifyContent: 'center' }}>
								<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
									<Image resizeMode={'stretch'} source={addProjects} />
								</View>
							</View>
							<View style={{ paddingHorizontal: 30 }}>
								<View style={[ProjectsStyles.flexLeft]}>
									<Text style={[ProjectsStyles.header, { color: ThemeColors.blue_lightest }]}>
										{this.props.screenProps.t('projects:addFirstProject')}
									</Text>
								</View>
								<View style={{ width: '100%' }}>
									<View style={ProjectsStyles.divider} />
								</View>
								<View style={ProjectsStyles.flexLeft}>
									<Text style={ProjectsStyles.infoBox}>{this.props.screenProps.t('projects:visitIXO')}</Text>
								</View>
							</View>
						</View>
					)}
				</Container>
			</ImageBackground>
		);
	}

	renderConnectivity() {
		if (this.props.online) return null;
		return <Banner text={this.props.screenProps.t('dynamics:offlineMode')} />;
	}

	render() {
		return (
			<Drawer
				ref={ref => {
					// @ts-ignore
					this.drawer = ref;
				}}
				content={<SideBar screenProps={this.props.screenProps} navigation={this.props.navigation} />}
				onClose={() => this.closeDrawer()}
			>
				{this.renderConnectivity()}
				{this.props.projects.length > 0 ? this.renderNoProjectsView() : this.renderProjectsView()}
				<Fab
					direction="up"
					style={{ backgroundColor: ThemeColors.red }}
					position="bottomRight"
					onPress={() => this.props.navigation.navigate('ScanQR', { projectScan: true })}
				>
					<Image resizeMode={'contain'} style={{ width: width * 0.08, height: width * 0.08 }} source={qr} />
				</Fab>
			</Drawer>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user,
		projects: state.projectsStore.projects,
		projectsLocalStates: state.projectsStore.projectsLocalStates,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims,
		online: state.dynamicsStore.online
	};
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onIxoInit: () => {
			dispatch(initIxo(env.REACT_APP_BLOCKCHAIN_IP, env.REACT_APP_BLOCK_SYNC_URL));
		},
		onProjectsUpdate: (projects: any) => {
			dispatch(updateProjects(projects));
		},
		onProjectSelect: (project: IProject) => {
			dispatch(loadProject(project));
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Projects);
