import React from 'react';
import { StatusBar, Dimensions } from 'react-native';
import { Container, Icon, Content, View, Text, Spinner } from 'native-base';

import { ThemeColors } from '../styles/Colors';
import NewClaimStyles from '../styles/NewClaim';
import LightButton from '../components/LightButton';
import DynamicForm from '../components/form/DynamicForm';
import { FormStyles } from '../models/form';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
const { width, height } = Dimensions.get('window');
import { connect } from 'react-redux';
import { decode as base64Decode } from 'base-64';

interface PropTypes {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

interface StateTypes {
	formFile: string | null;
	fetchedFile: any;
}
export interface StateProps {
	ixo?: any;
}

export interface Props extends PropTypes, StateProps {}

class NewClaim extends React.Component<Props, StateTypes> {
	constructor(props: Props) {
		super(props);
		this.state = {
			fetchedFile: null,
			formFile: null
		};
	}

	componentDidMount() {
		let componentProps: any = this.props.navigation.state.params;
		if (componentProps) {
			this.fetchFormFile(componentProps.claimForm, componentProps.pdsURL);
		}
	}

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

	fetchFormFile = (claimFormKey: string, pdsURL: string) => {
		this.props.ixo.project.fetchPublic(claimFormKey, pdsURL).then((res: any) => {
			console.log('Fetched: ', res);
			let fileContents = base64Decode(res.data);
			console.log('fileContents: ', fileContents);
			this.setState({ fetchedFile: fileContents });
		});
	};

	onFormSubmit(formData: any) {}

	renderForm() {
		const claimParsed = JSON.parse(this.state.fetchedFile!);
		if (this.state.fetchedFile) {
			return <DynamicForm formSchema={claimParsed.fields} formStyle={FormStyles.standard} handleSubmit={this.onFormSubmit} />;
		} else {
			return <Spinner color={ThemeColors.blue_light} />;
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.grey_sync, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle="light-content" />
				<View style={{ height: height * 0.18, backgroundColor: ThemeColors.blue_dark, paddingHorizontal: '3%', paddingTop: '2%' }}>
					<Text style={{ color: ThemeColors.blue_lightest, fontSize: 12 }}>Claim created 05-05-1991</Text>
				</View>
				<View
					style={[NewClaimStyles.formContainer, { position: 'absolute', height: height - 250, top: 30, alignSelf: 'center', width: '95%' }]}
				>
					{this.renderForm()}
				</View>

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
				<LightButton
					propStyles={{ backgroundColor: ThemeColors.red, borderColor: ThemeColors.red, borderRadius: 0 }}
					onPress={() => this.props.navigation.navigate('NewClaim', {})}
					text={this.props.screenProps.t('claims:submitButton')}
				/>
			</Container>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo
	};
}

export default connect(mapStateToProps)(NewClaim);
