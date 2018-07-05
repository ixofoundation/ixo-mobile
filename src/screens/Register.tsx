import React from 'react';
import { SecureStore } from 'expo';
import { StatusBar, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Container, Icon, View, Item, Label, Input, Button, Text } from 'native-base';
import { CreateNewVaultAndRestore } from '../utils/sovrin'; 
import { SecureStorageKeys, LocalStorageKeys } from '../models/phoneStorage';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';
import RegisterStyles from '../styles/Register';

enum registerSteps {
    captureDetails = 1,
    revealMnemonic,
    reenterMnemonic,
}

interface PropTypes {
    navigation: any;
};

interface StateTypes {
    username: string;
    password: string;
    confirmPassword: string;
    registerState: registerSteps;
    mnemonic: string;
    selectedWords: string[];
    unSelectedWords: string[];
    errorMismatch: boolean;
}

interface NavigationTypes {
    navigation: any;
}

class Register extends React.Component<PropTypes, StateTypes> {

    state = {
        username: '',
        password: '',
        confirmPassword: '',
        registerState: registerSteps.captureDetails,
        mnemonic: '',
        selectedWords: [],
        unSelectedWords: [],
        errorMismatch: false,
    }

    async generateMnemonic() {
        // try {
        //     const mnemonic = await bip39.generateMnemonic();
        //     this.setState({ mnemonic });
        // } catch(e) {
        //     return false
        // }
        const testMonic = 'surprise boat glance fetch cute gossip domain all marble orchard entire rookie';

        this.setState({ unSelectedWords: this.shuffleArray(testMonic.split(' ')), mnemonic: testMonic });
    }

    shuffleArray(array: string[]) { // Durstenfeld shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
        }
        return array;
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

    handleConfirmMnemonic() {
        const goToLogin = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Login'}),
            ]
          });
        if (this.state.selectedWords.join(' ') !== this.state.mnemonic) {
            this.setState({ errorMismatch: true });
        } else {
            CreateNewVaultAndRestore(this.state.username, this.state.password, this.state.mnemonic); // encrypt securely on phone enlave
            SecureStore.setItemAsync(SecureStorageKeys.password, this.state.password); // save local password
            AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true'); // stop first time onboarding
            this.props.navigation.dispatch(goToLogin);
        }
    }

    handleCreatePassword() {
        if (this.state.confirmPassword === '' || this.state.password === '' || this.state.username === '') {
            return;
        }

        if (this.state.password === this.state.confirmPassword) {
            this.setState({ registerState: registerSteps.revealMnemonic });
        }
    }

    renderStep(index: registerSteps) {
        switch(index) {
            case registerSteps.captureDetails:
                return (
                    <View>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Let's set up your account</Text>
                        <Item floatingLabel>
                            <Label>Your name</Label>
                            <Input value={this.state.username} onChangeText={(text) => this.setState({ username: text })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>New password</Label>
                            <Input value={this.state.password} onChangeText={(text) => this.setState({ password: text })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Confirm password</Label>
                            <Input value={this.state.confirmPassword} onChangeText={(text) => this.setState({ confirmPassword: text })} />
                        </Item>
                        <View style={[ContainerStyles.flexColumn, { paddingTop: 60 }]}>
                            <Button onPress={() => this.handleCreatePassword()} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Create</Text></Button>
                        </View>
                    </View>
                );
            case registerSteps.revealMnemonic:
                return (
                    <View>
                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Secret Backup Phrase</Text>

                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>Your secret backup phrase makes it easy to back up and restore your account</Text>

                        <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingBottom: 10 }}>WARNING: Never disclose your backup phrase and store it somewhere secure</Text>

                        <TouchableOpacity onPress={() => this.generateMnemonic()} style={[RegisterStyles.selectedBox]}>
                            {(this.state.mnemonic.length <= 0) ?
                                <View>
                                    <Icon name='lock' color={ThemeColors.black} style={{ fontSize: 60, textAlign: 'center' }} />
                                    <Text style={{ textAlign: 'center', color: ThemeColors.black, paddingHorizontal: 10 }}>Click here to reveal secret words</Text>
                                </View> :
                                <View>
                                    <Text style={{ textAlign: 'left', color: ThemeColors.black, paddingHorizontal: 10 }}>{this.state.mnemonic}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                        {(this.state.mnemonic.length > 0) &&
                        <View style={[ContainerStyles.flexColumn, { paddingTop: 60 }]}>
                            <Button onPress={() => this.setState({ registerState: registerSteps.reenterMnemonic })} style={RegisterStyles.button} bordered dark><Text>Next</Text></Button>
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
                        {(this.state.errorMismatch) && <Text style={{ textAlign: 'left', color: 'red', paddingBottom: 7 }}>The order is incorrect</Text>}
                        {this.renderSelected()}
                        {this.renderUnSelected()}
                        <View style={[ContainerStyles.flexColumn]}>
                            <Button onPress={() => this.handleConfirmMnemonic()} style={RegisterStyles.button} bordered dark><Text>Confirm</Text></Button>
                        </View>
                    </View>
                );
        }
    }

    renderSelected() {
        return (
            <View style={[RegisterStyles.selected]}>
                {this.state.selectedWords.map((word) =>{
                    return <TouchableOpacity onPress={() => this.handleSelectedToUnselected(word)} key={word}><Text style={RegisterStyles.wordBox}>{word}</Text></TouchableOpacity>
                })}
            </View>
        );
    }

    renderUnSelected() {
        return (
            <View style={[RegisterStyles.unSelect]}>
                {this.state.unSelectedWords.map((word) => {
                    return <TouchableOpacity onPress={() => this.handleUnselectedToSelected(word)} key={word}><Text style={RegisterStyles.wordBox}>{word}</Text></TouchableOpacity>
                })}
            </View>
        );
    }

    render() {
        return (
            <Container>
                <StatusBar barStyle="dark-content" />
                    <View style={RegisterStyles.wrapper}>
                        {this.renderStep(this.state.registerState)}
                    </View>                
            </Container>    
        );
    }
};

export default Register;
