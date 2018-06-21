import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Ixo } from 'ixo-module';
import _ from 'underscore';
import { Container, Header, Item, Icon, Input, Content, View, Text } from 'native-base';
import HeaderSync from '../components/HeaderSync';

import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import { IProject } from '../components/models/Project';
import { ThemeColors, ProjectStatus } from '../styles/Colors';

interface PropTypes {
  navigation: any,
  projects: IProject[],
};

export default class Projects extends React.Component<PropTypes> {
  state = {
    projects: []
  };

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

  componentDidMount() {
    const ixo = new Ixo();
    ixo.project.listProjects().then((response: any) => {
      const { result = [] } = response;
      const projects: IProject[] = [];
      _.each(result, (item: IProject) => {
        projects.push(item);
      });
      this.setState({ projects });
    }).catch((result: Error) => {
      console.log(result);
    });
  }

  renderProject() { // will become a mapping
    return (
      <View>
        {this.state.projects.map((project: IProject) => {
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
                        <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 10 }}>Your last claim submitted on<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 10 }}> 2019-02-01</Text></Text>
                      </View>
                    </View>
                  </View>
              </View>
              <View style={[ContainerStyles.flexRow, { backgroundColor: ThemeColors.grey_sync, height: 3 }]} />
            </TouchableOpacity>
          );
        })}
        
      </View>
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