import React from 'react';
import { StatusBar, Dimensions } from 'react-native';
import { Container, Icon, Content, View, Text } from 'native-base';

import { ThemeColors } from '../styles/Colors';
import NewClaimStyles from '../styles/NewClaim';
import LightButton from '../components/LightButton';
const { width, height } = Dimensions.get('window');

interface PropTypes {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

interface StateTypes {
	formFile: string | null;
}

class NewClaim extends React.Component<PropTypes, StateTypes> {
	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const {
			state: {
				params: { title = 'Project Name' }
			}
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			// headerLeft: <Icon name="close" onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />,
			title,
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	};

	state = {
		formFile: null
	};

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.grey_sync, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle="light-content" />
				<View style={{ height: height * 0.18, backgroundColor: ThemeColors.blue_dark, paddingHorizontal: '3%', paddingTop: '2%' }}>
					<Text style={{ color: ThemeColors.blue_lightest, fontSize: 12 }}>Claim created 05-05-1991</Text>
				</View>
				<View style={[NewClaimStyles.formContainer, { position: 'absolute', height: height - 250, top: 30, alignSelf: 'center', width: '95%' }]} />
				
					{/* <View>
                        <Item floatingLabel>
                            <Label>Name</Label>
                            <Input />
                        </Item>
                        <Item style={{ marginTop: 20 }}>
                            <Input placeholder='Type of panel installed'/>
                            <Icon active name='arrow-down' style={{ color: ThemeColors.grey }} />
                        </Item>
                        <Item style={{ marginTop: 20 }}>
                            <Input placeholder='Comments'/>
                        </Item>
                    </View>

                    <View style={[ContainerStyles.flexColumn]}>
                        <Button style={{ width: '100%', justifyContent: 'center' }} iconLeft bordered dark><Icon name='camera' style={{ color: ThemeColors.grey }} /><Text>Attach image</Text></Button>
                        <Button style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Scan QR code</Text></Button>
                    </View>
                        
                    <View style={[ContainerStyles.flexColumn]}>
                        <Button style={{ width: '100%', justifyContent: 'center' }} bordered dark><Text>Save</Text></Button>
                        <Button style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} bordered dark><Text>Submit</Text></Button>
					</View> */}
					<LightButton propStyles={{ backgroundColor: ThemeColors.red, borderColor: ThemeColors.red, borderRadius: 0 }} onPress={() => this.props.navigation.navigate('NewClaim', { projectDid, title })} text={this.props.screenProps.t('claims:submitButton')} />
			</Container>
		);
	}
}

export default NewClaim;
