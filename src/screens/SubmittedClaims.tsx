// TODO styling needs to move to styling file

import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Item, Icon, Input, Content, Text, View } from 'native-base';
import HeaderSync from '../components/HeaderSync';

import Containers from '../styles/Containers';
import SubmittedClaimsStyles from '../styles/SubmittedClaims';
import ContainerStyles from '../styles/Containers';
import { ThemeColors } from '../styles/Colors';

const dummyData = [ // TODO get correct data structure
    { id: '1',
      projectName: '1 solar panel installed',
      percentage: '2/1298',
      description: '250W Solar Panel',
      lastClaimDate: '05-05-18',
      status: '#FF495F' },
      { id: '2',
        projectName: '1 solar panel installed',
      percentage: '10/1298',
      description: '250W Solar Panel',
      lastClaimDate: '28-02-18',
      status: '#FFB03D' },
      { id: '3',
        projectName: '1 solar panel installed',
      percentage: '50/85',
      description: '250W Solar Panel',
      lastClaimDate: '23-01-18',
      status: '#7CBBFF' },
  ];

interface PropTypes {
  navigation: any,
};

interface NavigationTypes {
    navigation: any,
}

export default class SubmittedClaims extends React.Component<PropTypes> {
  static navigationOptions = (props: NavigationTypes) => {
    return {
      headerRight: (
        <HeaderSync />
      ),
      headerLeft: (
        <Icon name='arrow-back' onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />
      ),
      title: 'Project Name',
      headerTitleStyle : {
        color: ThemeColors.black,
        textAlign: 'center',
        alignSelf:'center'
      },
      headerTintColor: ThemeColors.black,
    };
  };

  renderClaims() {
    return (
    <View>
        {dummyData.map((project) => {
            return (
                <TouchableOpacity key={project.id} style={SubmittedClaimsStyles.ProjectBox}>
                    <View style={ContainerStyles.flexRow}>
                        <View style={[ContainerStyles.flexColumn, { padding: 5 }]}>
                            <View style={[ContainerStyles.flexRow, ContainerStyles.textBoxLeft]}>
                                <View style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
                                <Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 19, fontWeight: '400'  }}>{project.projectName}</Text>
                                <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 15  }}>{project.description}</Text>
                                <View style={{ height: 20 }} />
                                <Text style={{ textAlign: 'left', color: ThemeColors.grey, fontSize: 10 }}>Your last claim submitted on<Text style={{ textAlign: 'left', color: ThemeColors.black, fontSize: 10 }}> {project.lastClaimDate}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={[SubmittedClaimsStyles.ProjectBoxStatusBar, { backgroundColor: project.status}]} />
                    </View>
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
        <Header style={{ borderBottomWidth: 0 }}>
          <View style={[Containers.flexRow, { justifyContent: 'space-between' }]}>
          
            <TouchableOpacity style={[Containers.flexRow, SubmittedClaimsStyles.BadgeBoxContainer]}>
              <View style={[Containers.flexRow, SubmittedClaimsStyles.Badge]}>
                <Text style={{ color: ThemeColors.black, textAlign: 'left', padding: 5, fontSize: 13}}>67</Text>
              </View>
              <Text style={{ color: ThemeColors.black, paddingTop: 5, paddingBottom: 5 }}>    Saved</Text>
            </ TouchableOpacity>

            <TouchableOpacity style={[Containers.flexRow, SubmittedClaimsStyles.BoxContainer]}>
              <Text style={{ color: ThemeColors.black, paddingTop: 5, paddingBottom: 5 }}>Submitted</Text>
            </ TouchableOpacity>

          </View>
        </Header>
        <Header searchBar rounded style={{ borderBottomWidth: 0 }}>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search my claims" />
          </Item>
        </Header>
        <Content style={{ backgroundColor: ThemeColors.white }}>
          {this.renderClaims()}
        </Content>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('NewClaim')} style={SubmittedClaimsStyles.SubmitButton}>
          <View style={Containers.flexColumn}>
            <Text style={{ color: ThemeColors.black, fontSize: 15 }}>Submit Claim</Text>
          </View>
        </TouchableOpacity>
      </Container>
    );
  }
}