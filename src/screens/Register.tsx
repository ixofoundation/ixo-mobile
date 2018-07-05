import React from 'react';
import { StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Icon, View, Item, Label, Input, Button, Text } from 'native-base';
import bip39 from 'react-native-bip39';
// var bip39 = require('react-native-bip39');

import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';

const deviceHeight = Dimensions.get("window").height;

enum registerSteps {
    captureDetails = 1,
    revealMnemonic,
    reenterMnemonic,
}

interface PropTypes {
    navigation: any;
};

interface StateTypes {
    name: string;
    password: string;
    confirmPassword: string;
    registerState: registerSteps;
    mnemonic: string;
    selectedWords: string[];
    unSelectedWords: string[];
}

interface NavigationTypes {
    navigation: any;
}

const MnemonticTextAreaView = () => (
    <View style={[ContainerStyles.flexColumn, { borderColor: ThemeColors.black, borderWidth: 2, height: 50, backgroundColor: 'red' }]}>
        <Icon name='lock' color={ThemeColors.black} style={{ fontSize: 60 }} />
        <Text style={{ textAlign: 'center', color: ThemeColors.black, paddingHorizontal: 10 }}>Click here to reveal secret words</Text>
    </View>
);

class Register extends React.Component<PropTypes, StateTypes> {
    // static navigationOptions = (props: NavigationTypes) => {
    //     return {
    //         headerLeft: (
    //             <Icon name='close' onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />
    //         ),
    //         title: 'New',
    //         headerTitleStyle : {
    //         color: ThemeColors.black,
    //         textAlign: 'center',
    //         alignSelf:'center'
    //         },
    //         headerTintColor: ThemeColors.black,
    //     };
    // };

    state = {
        name: '',
        password: '',
        confirmPassword: '',
        registerState: registerSteps.captureDetails,
        mnemonic: '',
        selectedWords: [],
        unSelectedWords: [],
    }

    async generateMnemonic() {
        // console.log(bip39.generateMnemonic())
        try {
            const mnemonic = await bip39.generateMnemonic();
            this.setState({ mnemonic });
        } catch(e) {
            return false
        }
        const testMonic = 'surprise boat glance fetch cute gossip domain all marble orchard entire rookie';
        this.setState({ unSelectedWords: testMonic.split(' '), mnemonic: testMonic });
    }

    renderStep(index: registerSteps) {
        switch(index) {
            case registerSteps.captureDetails:
                return (
                    <View>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Let's set up your account</Text>
                        <Item floatingLabel>
                            <Label>Your name</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel>
                            <Label>New password</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel>
                            <Label>Confirm password</Label>
                            <Input />
                        </Item>
                        <View style={[ContainerStyles.flexColumn, { paddingTop: 60 }]}>
                            <Button onPress={() => this.setState({ registerState: registerSteps.revealMnemonic })} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Create</Text></Button>
                        </View>
                    </View>
                );
            case registerSteps.revealMnemonic:
                return (
                    <View>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Secret Backup Phrase</Text>

                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Your secret backup phrase makes it easy to back up and restore your account</Text>

                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>WARNING: Never disclose your backup phrase and store it somewhere secure</Text>

                        <TouchableOpacity onPress={() => this.generateMnemonic()} style={[{ borderColor: ThemeColors.black, borderWidth: 2, height: deviceHeight * 0.3, justifyContent: 'center' }]}>
                            {(this.state.mnemonic.length <= 0) ?
                                <View>
                                    <Icon name='lock' color={ThemeColors.black} style={{ fontSize: 60, textAlign: 'center' }} />
                                    <Text style={{ textAlign: 'center', color: ThemeColors.black, paddingHorizontal: 10 }}>Click here to reveal secret words</Text>
                                </View> :
                                <View>
                                    <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingHorizontal: 10 }}>{this.state.unSelectedWords.join(' ')}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        {(this.state.mnemonic.length > 0) &&
                        <View style={[ContainerStyles.flexColumn, { paddingTop: 60 }]}>
                            <Button onPress={() => this.setState({ registerState: registerSteps.reenterMnemonic })} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Next</Text></Button>
                        </View>
                        }
                    </View>
                );
            case registerSteps.reenterMnemonic:
                return (
                    <View>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Confirm your Secrete Backup Phrase</Text>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Please select each phrase in order to make sure it is correct.</Text>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Please select each phrase in order to make sure it is correct.</Text>
                        {this.renderSelected()}
                        {this.renderUnSelected()}
                    </View>
                );
        }
    }

    renderSelected() {
        return (
            <View style={[{ borderColor: ThemeColors.black, borderWidth: 2, height: deviceHeight * 0.3, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }]}>
                {this.state.selectedWords.map((word) =>{
                    return <TouchableOpacity onPress={() => this.handleSelectedToUnselected(word)} key={word}><Text style={{ borderColor: ThemeColors.black, borderWidth: 1, padding: 4, margin: 4 }}>{word}</Text></TouchableOpacity>
                })}
            </View>
        );
    }

    handleUnselectedToSelected(word: string) {
        const selectedWords = this.state.selectedWords;
        selectedWords.push(word);
        this.setState({
            unSelectedWords: this.state.unSelectedWords.filter(e => e !== word),
            selectedWords: selectedWords,
        });
    }

    handleSelectedToUnselected(word: string) {
        const unSelectedWords = this.state.unSelectedWords;
        unSelectedWords.push(word);
        this.setState({
            selectedWords: this.state.selectedWords.filter(e => e !== word),
            unSelectedWords: unSelectedWords,
        });
    }

    renderUnSelected() {
        return (
            <View style={[{ height: deviceHeight * 0.3, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }]}>
                {this.state.unSelectedWords.map((word) => {
                    return <TouchableOpacity onPress={() => this.handleUnselectedToSelected(word)} key={word}><Text style={{ borderColor: ThemeColors.black, borderWidth: 1, padding: 4, margin: 4 }}>{word}</Text></TouchableOpacity>
                })}
            </View>
        );
    }

    render() {
        return (
            <Container>
                <StatusBar barStyle="dark-content" />
                    <View style={{ backgroundColor: ThemeColors.white, padding: 20, flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                        {this.renderStep(this.state.registerState)}
                    </View>                
            </Container>    
        );
    }
};

export default Register;
