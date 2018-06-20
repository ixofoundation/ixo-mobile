import React from 'react';
import { StatusBar } from 'react-native';
import { Container, Icon, Content, View, Text, Button, Item, Input, Label } from 'native-base';

import ContainerStyles from '../styles/Containers';
import Colors from '../styles/Colors';


interface PropTypes {
    navigation: any,
};  

interface NavigationTypes {
    navigation: any,
}

class NewClaim extends React.Component<PropTypes> {
    static navigationOptions = (props: NavigationTypes) => {
        return {
            headerLeft: (
                <Icon name='close' onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />
            ),
            title: 'New',
            headerTitleStyle : {
            color: Colors.black,
            textAlign: 'center',
            alignSelf:'center'
            },
            headerTintColor: Colors.black,
        };
    };

    render() {
        return (
            <Container>
                <StatusBar barStyle="light-content" />
                <Content contentContainerStyle={{ backgroundColor: Colors.white, padding: 20, flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                
                    <View>
                        <Item floatingLabel>
                            <Label>Name</Label>
                            <Input />
                        </Item>
                        <Item style={{ marginTop: 20 }}>
                            <Input placeholder='Type of panel installed'/>
                            <Icon active name='arrow-down' style={{ color: Colors.grey }} />
                        </Item>
                        <Item style={{ marginTop: 20 }}>
                            <Input placeholder='Comments'/>
                        </Item>
                    </View>

                    <View style={[ContainerStyles.flexColumn]}>
                        <Button style={{ width: '100%', justifyContent: 'center' }} iconLeft bordered dark><Icon name='camera' style={{ color: Colors.grey }} /><Text>Attach image</Text></Button>
                        <Button style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Scan QR code</Text></Button>
                    </View>
                        
                    <View style={[ContainerStyles.flexColumn]}>
                        <Button style={{ width: '100%', justifyContent: 'center' }} bordered dark><Text>Save</Text></Button>
                        <Button style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Submit</Text></Button>
                    </View>
                    
                </Content>
            </Container>    
        );
    }
};

export default NewClaim;
