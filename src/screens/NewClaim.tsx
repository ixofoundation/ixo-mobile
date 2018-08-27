import React from 'react';
import { env } from '../../config';
import { StatusBar, Dimensions } from 'react-native';
import { Container, Content, View, Text, Spinner, Toast } from 'native-base';

import { ThemeColors } from '../styles/Colors';
import NewClaimStyles from '../styles/NewClaim';
import DynamicForm from '../components/form/DynamicForm';
import { FormStyles } from '../models/form';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
const { height } = Dimensions.get('window');
import { connect } from 'react-redux';
import { decode as base64Decode } from 'base-64';
import { GetSignature } from '../utils/sovrin';

const placeholder = require('../../assets/ixo-placeholder.jpg');

interface ParentProps {
	navigation: any;
	screenProps: any;
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

export interface Props extends ParentProps, StateProps {}

class NewClaim extends React.Component<Props, StateTypes> {
	private pdsURL: string = '';
	private projectDid: string | undefined;

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
			this.pdsURL = componentProps.pdsURL;
			this.pdsURL = __DEV__ ? componentProps.pdsURL.replace(/localhost/g, env.REACT_IXO_LOCAL_ENV_IP) : componentProps.pdsURL
			this.fetchFormFile(componentProps.claimForm, this.pdsURL);
			this.projectDid = componentProps.projectDid;
		}
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const {
			state: {
				params: { title = 'New Claim' }
			}
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
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
			let fileContents = base64Decode(res.data);
			this.setState({ fetchedFile: fileContents });
		}).catch((error: Error) => {
			console.log(error);
		});
	};

	handleSubmitClaim = (claimData: any) => {
		let claimPayload = Object.assign(claimData);
		claimPayload['projectDid'] = this.projectDid;

		GetSignature(claimPayload).then((signature: any) => {
			this.props.ixo.claim.createClaim(claimPayload, signature, this.pdsURL).then((response: any) => {
				this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: true });
			}).catch((claimError: Error) => {
				this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: false });
			});
		}).catch((error: Error) => {
			console.log(error);
			Toast.show({
				text: this.props.screenProps.t('claims:signingFailed'),
				buttonText: 'OK',
				type: 'danger',
				position: 'top'
			});
		});
	}

	onFormSubmit = (formData: any) => {
		// upload all the images and change the value to the returned hash of the image
		let formDef = JSON.parse(this.state.fetchedFile);		
		let promises: Promise<any>[] = [];
		formDef.fields.forEach((field:any) => {			
			if (field.type === 'image') {
				if (formData[field.name] && formData[field.name].length > 0) {
					promises.push(
						this.props.ixo.project.createPublic(formData[field.name], this.pdsURL).then((res: any) => {
							formData[field.name] = res.result;
							Toast.show({
								text: this.props.screenProps.t('claims:imageUploaded'),
								buttonText: 'OK',
								type: 'success',
								position: 'top'
							});
							return res.result;
						})
					);
				}
			}
		});
		Promise.all(promises).then((results) => {
			this.handleSubmitClaim(formData);
		});
	}

	renderForm() {
		const claimParsed = JSON.parse(this.state.fetchedFile!);
		if (this.state.fetchedFile) {
			return <DynamicForm editable={true} screenProps={this.props.screenProps} formSchema={claimParsed.fields} formStyle={FormStyles.standard} handleSubmit={this.onFormSubmit} />;
		} else {
			return <Spinner color={ThemeColors.blue_light} />;
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.grey_sync, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle="light-content" />
				<View style={{ height: height * 0.18, backgroundColor: ThemeColors.blue_dark, paddingHorizontal: '3%', paddingTop: '2%' }}>
				</View>
				<View
					style={[NewClaimStyles.formContainer, { position: 'absolute', height: height - 160, top: 30, alignSelf: 'center', width: '95%' }]}
				>
					<Content style={{ paddingHorizontal: 10 }}>
						{this.renderForm()}
					</Content>
				</View>
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
