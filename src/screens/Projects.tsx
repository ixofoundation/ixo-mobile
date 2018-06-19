// TODO styling needs to move to styling file

import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Ixo } from 'ixo-module';

import { Container, Header, Item, Icon, Input, Content, View, Text, Drawer } from 'native-base';
import HeaderSync from '../components/HeaderSync';

import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import Colors from '../styles/Colors';

const dummyData = [ // TODO get correct data structure
  { id: '1',
    projectName: 'India solar project',
    percentage: '2/1298',
    description: 'solar panels installed',
    lastClaimDate: '05-05-18',
    status: '#FCBA3F' },
    { id: '2',
      projectName: 'Sea turtle project',
    percentage: '10/1298',
    description: 'sea turtles tagged',
    lastClaimDate: '28-02-18',
    status: '#377243' },
    { id: '3',
      projectName: 'Greece refugee food program',
    percentage: '50/85',
    description: '15kg bread flour bags purchased',
    lastClaimDate: '23-01-18',
    status: '#FCBA3F' },
];

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

  constructor(props: any) {
    super(props);
    
  }

  componentDidMount() {
    // const ixo = new Ixo();
    // ixo.project.listProjects().then((response: any) => {
    //     console.log('Project list: ' + JSON.stringify(response.result, null, '\t'));
    //     //expect(response.result).to.not.equal(null);
    // }).catch((result: Error) => {
    //     console.log(result);
    // });
  }

  renderProject() { // will become a mapping
    return (
      <View>
        {dummyData.map((project) => {
          return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Claims')} key={project.id} style={ProjectsStyles.projectBox}>
              <View style={ContainerStyles.flexRow}>
                <View style={[ProjectsStyles.projectBoxStatusBar, { backgroundColor: project.status}]} />
                  <View style={[ContainerStyles.flexColumn, { padding: 5 }]}>
                    <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
                      <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
                        <Text style={{ textAlign: 'left', color: Colors.black, fontSize: 19  }}>{project.projectName}</Text>
                        <Text style={{ textAlign: 'left', color: Colors.grey, fontSize: 17  }}>{project.percentage}</Text>
                        <Text style={{ textAlign: 'left', color: Colors.grey, fontSize: 15  }}>{project.description}</Text>
                        <Text style={{ textAlign: 'left', color: Colors.grey, fontSize: 10 }}>Your last claim submitted on<Text style={{ textAlign: 'left', color: Colors.black, fontSize: 10 }}> {project.lastClaimDate}</Text></Text>
                      </View>
                    </View>
                  </View>
              </View>
              <View style={[ContainerStyles.flexRow, { backgroundColor: Colors.grey_sync, height: 3 }]} />
            </TouchableOpacity>
          )
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
        <Content style={{ backgroundColor: Colors.white }}>
          {this.renderProject()}
        </Content>
      </Container>
    );
  }
}