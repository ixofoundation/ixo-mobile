import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import _ from 'underscore';
import moment from 'moment';
import { LinearGradient } from 'expo';
import { Container, Header, Item, Icon, Input, Content, View, Text, Spinner, Drawer } from 'native-base';

import HeaderSync from '../components/HeaderSync';
import SideBar from '../components/SideBar';
import Consumer from '../components/context/ConfigContext';

import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import { IProject, IClaim } from '../models/project';
import { ThemeColors, ProjectStatus } from '../styles/Colors';

interface PropTypes {
  navigation: any,
};

export default class Projects extends React.Component<PropTypes> {
  static navigationOptions = ({ navigation }: { navigation: any }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: (
        <Icon ios='ios-menu' onPress={() => params.drawer._root.open()} android="md-menu" style={{ paddingLeft: 10 }} />
      ),
      headerRight: (
        <HeaderSync />
      ),
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      drawer: this.drawer,
    });
  }

  closeDrawer() {
    this.drawer._root.close()
  };

  getLatestClaim(claims: IClaim[]): Date | undefined {
    const claim: IClaim | undefined = _.first(_.sortBy(claims, (claim: IClaim) => claim.date));
    if (claim) {
      return claim.date;
    }
    return undefined;
  }

  renderProgressBar = (total: number, approved: number, rejected: number) => {
    const approvedWidth = Math.ceil(approved / total * 100);
    const rejectedWidth = Math.ceil(rejected / total * 100);
    return (
      <View style={[ContainerStyles.flexRow, { justifyContent: 'flex-start' }]}>
      <LinearGradient start={[0, 1]} colors={['#016480', '#03d0FE']} style={{ height: 3, width: `${approvedWidth}%` }} />
      <View style={[{ backgroundColor: '#E2223B', height: 3, width: `${rejectedWidth}%` }]} />
      <View style={[{ backgroundColor: ThemeColors.grey_sync, height: 3, width: `${100 - approvedWidth - rejectedWidth}%`  }]} />
    </View>
    );
  };

  renderProject() { // will become a mapping
    return (
      <Consumer>
        {({ projects, getProjects }: { projects: IProject[], getProjects: Function }) => {
          if (!projects) {
            getProjects();
          }
          if (projects) {
            return (
            <React.Fragment>
              {projects.map((project: IProject) => {
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Claims', { projectDid: project.projectDid, title: project.data.title, pdsURL: project.data.serviceEndpoint })} key={project.projectDid} style={ProjectsStyles.projectBox}>
                    <View style={ContainerStyles.flexRow}>
                      <View style={[ProjectsStyles.projectBoxStatusBar, { backgroundColor: ProjectStatus.inProgress }]} />
                        <View style={[ContainerStyles.flexColumn, { padding: 5 }]}>
                          <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
                            <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
                              <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500' }}>{project.data.title}</Text>
                              <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 17  }}>{project.data.claimStats.currentSuccessful}<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 17, fontWeight: '500' }}>/{project.data.requiredClaims}</Text></Text>
                              <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 15  }}>{project.data.impactAction}</Text>
                              <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 10 }}>Your last claim submitted on<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 10 }}> {moment(this.getLatestClaim(project.data.claims)).format('YYYY-MM-DD')}</Text></Text>
                            </View>
                          </View>
                        </View>
                    </View>
                    {this.renderProgressBar(project.data.requiredClaims, project.data.claimStats.currentSuccessful, project.data.claimStats.currentRejected)}
                  </TouchableOpacity>
                );
              })}
            </React.Fragment>
          );
          }
          return <Spinner color={ThemeColors.black} />;
        }}
      </ Consumer>
    );
  }

  render() {
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigation={this.props.navigation} />}
        onClose={() => this.closeDrawer()}>
        <Container>
          <StatusBar barStyle="light-content" />
          <Header searchBar rounded style={{ borderBottomWidth: 0 }}>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search my projects" />
            </Item>
          </Header>
          <Content style={{ backgroundColor: ThemeColors.white }}>
            {this.renderProject()}
          </Content>
        </Container>
      </Drawer>
    );
  }
}