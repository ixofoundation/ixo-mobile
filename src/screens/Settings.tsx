import React from 'react';
import { StatusBar } from 'react-native';
import { Container, Icon, Content, View, Text, Button, Item, Input, Label } from 'native-base';

import ContainerStyles from '../styles/Containers';
import { ThemeColors, ProjectStatus } from '../styles/Colors';


interface PropTypes {
    navigation: any,
};  

interface NavigationTypes {
    navigation: any,
}

class Settings extends React.Component<PropTypes> {
    static navigationOptions = (props: NavigationTypes) => {
        return {
            headerLeft: (
                <Icon name='close' onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />
            ),
            title: 'Settings',
            headerTitleStyle : {
            color: ThemeColors.black,
            textAlign: 'center',
            alignSelf:'center'
            },
            headerTintColor: ThemeColors.black,
        };
    };

    render() {
        return (
            <Container>
                <StatusBar barStyle="dark-content" />
                <Content contentContainerStyle={{ backgroundColor: ThemeColors.white, padding: 20, flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                
                    
                </Content>
            </Container>    
        );
    }
};

export default Settings;
