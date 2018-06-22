// TODO styling needs to move to styling file
import * as React from 'react';
import { StatusBar, ListView, Alert, TouchableOpacity } from 'react-native';
import { Container, Header, Item, Icon, Input, Content, Text, List, Button, View } from 'native-base';
import HeaderSync from '../components/HeaderSync';

import Containers from '../styles/Containers';
import ClaimsStyles from '../styles/Claims';
import { ThemeColors } from '../styles/Colors';

const dummyData = [ // TODO get correct data structure
  { id: '1',
    address: 'sldkce2322kjsdlckd230092',
    submitDate: '04-09-18' },
  { id: '2',
    address: 'cd32de2322kjsdlckd24f292',
    submitDate: '04-09-18' },
  { id: '3',
    address: 'fddkce2322kjsdl1dws30092',
    submitDate: '04-09-18' },
];

interface PropTypes {
  navigation: any,
};

class Claims extends React.Component<{}, PropTypes> {
  static navigationOptions = () => {
    return {
      headerRight: (
        <HeaderSync />
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
    const ds = new ListView.DataSource({ rowHasChanged: (r1: any, r2: any) => r1 !== r2 });
    return (
      <List
        style={{ marginLeft: 6, marginRight: 6 }}
        rightOpenValue={-75}
        dataSource={ds.cloneWithRows(dummyData)}
        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
          <Button full danger
            style={ClaimsStyles.DeleteButton}
            onPress={ _ => {
            Alert.alert('Delete claim', 'Are you sure you want to delete the claim?',
            [{ text: 'OK',
            }, { text: 'Cancel' }]);
            }}
          >
            <Text style={ClaimsStyles.DeleteButtonText}>Delete</Text>
          </Button>}
        renderRow={claim =>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails')} >
            <View style={[Containers.flexColumn, ClaimsStyles.ClaimBox]}>
              <Text style={{ color: ThemeColors.grey, fontSize: 15 }}>{claim.address}</Text>
              <Text style={{ color: ThemeColors.grey, fontSize: 10 }}>{claim.submitDate}</Text>
            </View>
          </TouchableOpacity>
        }
      >
      </List>
    );
  }


  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Header style={{ borderBottomWidth: 0 }}>
          <View style={[Containers.flexRow, { justifyContent: 'space-between' }]}>
          
            <TouchableOpacity style={[Containers.flexRow, ClaimsStyles.BadgeBoxContainer]}>
              <View style={[Containers.flexRow, ClaimsStyles.Badge]}>
                <Text style={{ color: ThemeColors.black, textAlign: 'left', padding: 5, fontSize: 13}}>67</Text>
              </View>
              <Text style={{ color: ThemeColors.black, paddingTop: 5, paddingBottom: 5 }}>    Saved</Text>
            </ TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('SubmittedClaims')} style={[Containers.flexRow, ClaimsStyles.BoxContainer]}>
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
        <TouchableOpacity onPress={() => this.props.navigation.navigate('NewClaim')} style={ClaimsStyles.SubmitButton}>
          <View style={Containers.flexColumn}>
            <Text style={{ color: ThemeColors.black, fontSize: 15 }}>Submit Claim</Text>
          </View>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default Claims;