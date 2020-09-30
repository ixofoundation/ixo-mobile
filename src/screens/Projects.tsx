import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Content,
  Drawer,
  Fab,
  Header,
  Text,
  View,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { initIxo } from '../redux/ixo/actions';
import { loadProject } from '../redux/projects/actions';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import _ from 'underscore';

import { SDGArray } from '../models/sdg';
import {
  setLocalProjectImage,
  getLocalProjectImage,
} from '../utils/localCache';
import IxoHelper from '../utils/ixoHelper';

import Banner from '../components/Banner';
import CustomIcon from '../components/svg/CustomIcons';
import SideBar from '../components/SideBar';

import { env } from '../config';

// styles
import {
  ClaimsButton,
  ProgressSuccess,
  ProjectStatus,
  ThemeColors,
} from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';

// assets
import addProjects from '../../assets/project-visual.png';
import background from '../../assets/background_2.png';
import qr from '../../assets/qr.png';
import placeholder from '../../assets/ixo-placeholder.jpg';

const { width, height } = Dimensions.get('window');

const Projects = ({ screenProps }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const projectStore = useSelector((state) => state.projectsStore);
  const dynamicsStore = useSelector((state) => state.dynamicsStore);
  const userStore = useSelector((state) => state.userStore);
  const claimsStore = useSelector((state) => state.claimsStore);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    navigation.setParams({
      openDrawer,
      savedProjectsClaims: claimsStore.savedProjectsClaims,
    });
    dispatch(initIxo(env.REACT_APP_BLOCK_SYNC_URL));
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    navigation.closeDrawer();
    setIsDrawerOpen(false);
  };

  let _headerTitleShown = false;

  const getLatestClaim = (claims) => {
    const myClaims = claims.filter(
      (claimItem) => claimItem.saDid === userStore.did,
    );
    const claim = _.first(_.sortBy(myClaims, (claim) => claim.date));
    if (claim) {
      return (
        'Your last claim submitted on ' +
        moment(claim.date).format('YYYY-MM-DD')
      );
    } else {
      return 'You have no submitted claims on this project';
    }
  };

  const fetchImage = (project, localProjectState) => {
    if (dynamicsStore.online && !localProjectState) {
      // only fetch new images when online
      if (project.data.imageLink && project.data.imageLink !== '') {
        setLocalProjectImage(
          project.projectDid,
          `${project.data.serviceEndpoint}public/${project.data.imageLink}`,
        );
        return {
          uri: `${project.data.serviceEndpoint}public/${project.data.imageLink}`,
        };
      } else {
        return placeholder;
      }
    } else {
      return { uri: getLocalProjectImage(project.projectDid) };
    }
  };

  const renderProgressBar = (total, approved, rejected) => {
    if (rejected > total - approved) {
      rejected = total - approved;
    }
    const approvedWidth = Math.ceil((approved / total) * 100);
    const rejectedWidth = Math.ceil((rejected / total) * 100);
    return (
      <View
        style={[ContainerStyles.flexRow, ProjectsStyles.progressBarContainer]}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            ProgressSuccess.colorPrimary,
            ProgressSuccess.colorSecondary,
          ]}
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
              borderBottomLeftRadius: 0,
            },
          ]}
        />
        <View
          style={[
            {
              backgroundColor: ThemeColors.progressNotCounted,
              height: 5,
              width: `${100 - approvedWidth - rejectedWidth}%`,
              borderRadius: 2,
            },
          ]}
        />
      </View>
    );
  };

  const renderProjectImage = (project) => {
    const localProjectState = projectStore.projectsLocalStates.find(
      (projectLocal) => projectLocal.projectDid === project.projectDid,
    );
    return (
      <ImageBackground
        source={fetchImage(project, localProjectState)}
        style={ProjectsStyles.projectImage}>
        {localProjectState ? (
          <View style={{ marginRight: 20 }}>
            <View style={ProjectsStyles.projectStatusContainer}>
              <View
                style={[
                  ProjectsStyles.statusBlock,
                  { backgroundColor: ProjectStatus.inProgress },
                ]}
              />
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
  };

  const renderProject = () => {
    // will become a mapping
    return (
      <>
        {projectStore.projects.map((project) => {
          return (
            <TouchableOpacity
              onPress={() => {
                dispatch(loadProject(project));
                navigation.navigate('Claims');
              }}
              key={project.projectDid}
              style={ProjectsStyles.projectBox}>
              <View style={ContainerStyles.flexRow}>
                <View style={[ContainerStyles.flexColumn]}>
                  {renderProjectImage(project)}
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={[
                      ClaimsButton.colorPrimary,
                      ClaimsButton.colorSecondary,
                    ]}
                    style={[
                      ContainerStyles.flexRow,
                      ProjectsStyles.textBoxLeft,
                    ]}>
                    <View
                      style={[
                        ContainerStyles.flexColumn,
                        { alignItems: 'flex-start' },
                      ]}>
                      <Text style={ProjectsStyles.projectTitle}>
                        {project.data.title}
                      </Text>
                      <Text style={ProjectsStyles.projectSuccessfulAmountText}>
                        {project.data.claimStats.currentSuccessful}
                        <Text style={ProjectsStyles.projectRequiredClaimsText}>
                          /{project.data.requiredClaims}
                        </Text>
                      </Text>
                      <Text style={ProjectsStyles.projectImpactActionText}>
                        {project.data.impactAction}
                      </Text>
                      {renderProgressBar(
                        project.data.requiredClaims,
                        project.data.claimStats.currentSuccessful,
                        project.data.claimStats.currentRejected,
                      )}
                      <Text style={ProjectsStyles.projectLastClaimText}>
                        <Text style={ProjectsStyles.projectLastClaimText}>
                          {getLatestClaim(project.data.claims)}
                        </Text>
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const _onScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 20 && !_headerTitleShown) {
      // headerTitleShown prevents unnecessory rerendering for setParams
      navigation.setParams({
        showTitle: true,
      });
      _headerTitleShown = true;
    }
    if (y < 5 && _headerTitleShown) {
      navigation.setParams({
        showTitle: false,
      });
      _headerTitleShown = false;
    }
  };

  const renderNoProjectsView = () => {
    console.log('renderNoProjectsView');
    return (
      <Content
        style={{ backgroundColor: ThemeColors.blue_dark }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => IxoHelper.updateMyProjects()}
          />
        }
        // @ts-ignore
        onScroll={(event) => _onScroll(event)}>
        <Header
          noShadow
          style={{ borderBottomWidth: 0, backgroundColor: 'transparent' }}>
          <View style={[ProjectsStyles.flexLeft]}>
            <Text style={ProjectsStyles.myProjectsHeader}>
              {t('projects:myProjects')}
            </Text>
          </View>
        </Header>
        <StatusBar
          backgroundColor={ThemeColors.blue_dark}
          barStyle="light-content"
        />
        <Content>{renderProject()}</Content>
      </Content>
    );
  };

  const renderProjectsView = () => {
    console.log('renderProjectsView');
    return (
      <ImageBackground
        source={background}
        style={ProjectsStyles.backgroundImage}>
        <Container>
          <Header
            style={{
              borderBottomWidth: 0,
              backgroundColor: 'transparent',
              elevation: 0,
            }}>
            <View style={[ProjectsStyles.flexLeft]}>
              <Text style={ProjectsStyles.myProjectsHeader}>
                {t('projects:myProjects')}
              </Text>
            </View>
          </Header>
          <StatusBar
            backgroundColor={ThemeColors.blue_dark}
            barStyle="light-content"
          />
          {isRefreshing ? (
            <ActivityIndicator color={ThemeColors.white} />
          ) : (
            <View>
              <View
                style={{
                  height: height * 0.4,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View
                  style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <Image resizeMode={'stretch'} source={addProjects} />
                </View>
              </View>
              <View style={{ paddingHorizontal: 30 }}>
                <View style={[ProjectsStyles.flexLeft]}>
                  <Text
                    style={[
                      ProjectsStyles.header,
                      { color: ThemeColors.blue_lightest },
                    ]}>
                    {t('projects:addFirstProject')}
                  </Text>
                </View>
                <View style={{ width: '100%' }}>
                  <View style={ProjectsStyles.divider} />
                </View>
                <View style={ProjectsStyles.flexLeft}>
                  <Text style={ProjectsStyles.infoBox}>
                    {t('projects:visitIXO')}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Container>
      </ImageBackground>
    );
  };

  const renderConnectivity = () => {
    if (dynamicsStore.online) {
      return null;
    }
    return <Banner text={t('dynamics:offlineMode')} />;
  };

  return (
    <Drawer
      // ref={(ref) => {
      //   this.drawer = ref;
      // }}
      content={<SideBar screenProps={screenProps} navigation={navigation} />}
      onClose={() => closeDrawer()}>
      {renderConnectivity()}
      {console.log(
        'projectStore.projects.length: ',
        projectStore.projects.length,
      )}
      {projectStore.projects.length > 0
        ? renderNoProjectsView()
        : renderProjectsView()}
      <Fab
        direction="up"
        style={{ backgroundColor: ThemeColors.red }}
        position="bottomRight"
        onPress={() => navigation.navigate('ScanQR', { projectScan: true })}>
        <Image
          resizeMode={'contain'}
          style={{ width: width * 0.08, height: width * 0.08 }}
          source={qr}
        />
      </Fab>
    </Drawer>
  );
};

export default Projects;
