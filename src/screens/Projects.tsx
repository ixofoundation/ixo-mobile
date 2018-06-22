import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import _ from 'underscore';
import moment from 'moment';
import { Container, Header, Item, Icon, Input, Content, View, Text, Spinner } from 'native-base';

import HeaderSync from '../components/HeaderSync';
import Consumer from '../components/context/ConfigContext';

import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import { IProject, IClaim } from '../components/models/Project';
import { ThemeColors, ProjectStatus } from '../styles/Colors';

interface PropTypes {
  navigation: any,
};

export default class Projects extends React.Component<PropTypes> {
  static navigationOptions = () => {
    return {
      headerLeft: (
        <Icon ios='ios-menu' android="md-menu" style={{ paddingLeft: 10 }} />
      ),
      headerRight: (
        <HeaderSync />
      ),
    };
  };

  getLatestClaim(claims: IClaim[]): Date | undefined {
    const claim: IClaim | undefined = _.first(_.sortBy(claims, (claim: IClaim) => claim.date));
  
    if (claim) {
      return claim.date;
    }
    return undefined;
  }

  renderProject() { // will become a mapping
    return (
      <Consumer>
        {({ projects, getProjects }: { projects: IProject[], getProjects: any}) => {
          if (!projects) {
            getProjects();
          }
          if (projects) {
            return (
            <React.Fragment>
              {projects.map((project: IProject) => {
                return (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Claims')} key={project.projectDid} style={ProjectsStyles.projectBox}>
                    <View style={ContainerStyles.flexRow}>
                      <View style={[ProjectsStyles.projectBoxStatusBar, { backgroundColor: ProjectStatus.inProgress }]} />
                        <View style={[ContainerStyles.flexColumn, { padding: 5 }]}>
                          <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
                            <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
                              <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '500'   }}>{project.data.title}</Text>
                              <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 17  }}>{project.data.claimStats.currentSuccessful}<Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 17, fontWeight: '500' }}>/{project.data.requiredClaims}</Text></Text>
                              <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 15  }}>{project.data.impactAction}</Text>
                              <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 10 }}>Your last claim submitted on<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 10 }}> {moment(this.getLatestClaim(project.data.claims)).format('YYYY-MM-DD')}</Text></Text>
                            </View>
                          </View>
                        </View>
                    </View>
                    <View style={[ContainerStyles.flexRow, { backgroundColor: ThemeColors.grey_sync, height: 3 }]} />
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
    );
  }
}