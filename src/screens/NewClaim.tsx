import React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { Container, View, Spinner, Toast, Text, Icon } from 'native-base';
import { ThemeColors } from '../styles/Colors';
import { IProject, IClaim } from '../models/project';
import NewClaimStyles from '../styles/NewClaim';
import DynamicSwiperForm from '../components/form/DynamicSwiperForm';
import { FormStyles } from '../models/form';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { saveClaim } from '../redux/claims/claims_action_creators';
import { connect } from 'react-redux';
import { decode as base64Decode } from 'base-64';
import { getSignature } from '../utils/sovrin';

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface NavigationTypes {
	navigation: any;
}

interface StateTypes {
	fetchedFile: any;
	isLastCard: boolean;
}

export interface DispatchProps {
	onClaimSave: (claim: IClaim, projectDID: string) => void;
}

export interface StateProps {
	ixo?: any;
	project?: IProject;
}
export interface Props extends ParentProps, DispatchProps, StateProps {}

declare var dynamicForm: any;
class NewClaim extends React.Component<Props, StateTypes> {
	private pdsURL: string = '';
	private projectDid: string | undefined;
	private claimForm: string = '';
	private projectName: string = '';

	constructor(props: Props) {
		super(props);
		this.state = {
			fetchedFile: null,
			isLastCard: false
		};
		dynamicForm = React.createRef();

		if (props.project) {
			this.pdsURL = props.project.data.serviceEndpoint;
			this.claimForm = props.project.data.templates.claim.form;
			this.projectDid = props.project.projectDid;
			this.projectName = props.project.data.title;
		}
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const {
			state: { params: { projectName = 'Loading...', saveText = '' } = {} }
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			title: projectName,
			headerRight: <Text style={NewClaimStyles.headerSaveButton}>{saveText}</Text>,
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({
			projectName: this.projectName,
			saveText: this.props.screenProps.t('claims:saveClaim')
		});
		this.fetchFormFile(this.claimForm, this.pdsURL);
	}

	fetchFormFile = (claimFormKey: string, pdsURL: string) => {
		this.props.ixo.project
			.fetchPublic(claimFormKey, pdsURL)
			.then((res: any) => {
				let fileContents = base64Decode(res.data);
				this.setState({ fetchedFile: fileContents });
			})
			.catch((error: Error) => {
				console.log(error);
			});
	}

	onToggleLastCard = (active: boolean) => {
		this.setState({ isLastCard: active });
	}

	handleSubmitClaim = (claimData: any) => {
		let claimPayload = Object.assign(claimData);
		claimPayload['projectDid'] = this.projectDid;

		getSignature(claimPayload)
			.then((signature: any) => {
				this.props.ixo.claim
					.createClaim(claimPayload, signature, this.pdsURL)
					.then((response: any) => {
						this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: true });
					})
					.catch((claimError: Error) => {
						this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: false });
					});
			})
			.catch((error: Error) => {
				console.log(error);
				Toast.show({
					text: this.props.screenProps.t('claims:signingFailed'),
					buttonText: 'OK',
					type: 'danger',
					position: 'top'
				});
			});
	}

	onSaveClaim = () => {

	}

	onFormSubmit = (formData: any) => {
		// upload all the images and change the value to the returned hash of the image
		let formDef = JSON.parse(this.state.fetchedFile);
		let promises: Promise<any>[] = [];
		formDef.fields.forEach((field: any) => {
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
		Promise.all(promises).then(results => {
			this.handleSubmitClaim(formData);
		});
	}

	renderForm() {
		const claimParsed = JSON.parse(this.state.fetchedFile!);
		if (this.state.fetchedFile) {
			return (
				<DynamicSwiperForm
					ref={dynamicForm}
					screenProps={this.props.screenProps}
					formSchema={claimParsed.fields}
					formStyle={FormStyles.standard}
					handleSubmit={this.onFormSubmit}
					onToggleLastCard={this.onToggleLastCard}
				/>
			);
		} else {
			return <Spinner color={ThemeColors.white} />;
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle="light-content" />
				{this.renderForm()}
				<View style={NewClaimStyles.navigatorContainer}>
					<TouchableOpacity
						onPress={() => dynamicForm.current.goBack()}
						style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}
					>
						<Icon style={{ color: ThemeColors.blue_light, fontSize: 23 }} name="arrow-back" />
						<Text style={NewClaimStyles.backNavigatorButton}>{this.props.screenProps.t('claims:back')}</Text>
					</TouchableOpacity>
					{this.state.isLastCard ? (
						<TouchableOpacity
							onPress={() => dynamicForm.current.handleSubmit()}
							style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}
						>
							<Text style={NewClaimStyles.claimNavigatorButton}>{this.props.screenProps.t('claims:submitClaim')}</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={() => dynamicForm.current.goNext()}
							style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}
						>
							<Text style={NewClaimStyles.nextNavigatorButton}>{this.props.screenProps.t('claims:next')}</Text>
							<Icon style={{ color: ThemeColors.white, fontSize: 23 }} name="arrow-forward" />
						</TouchableOpacity>
					)}
				</View>
			</Container>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onClaimSave: (claim: IClaim, projectDID: string) => {
			dispatch(saveClaim(claim, projectDID));
		}
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		project: state.projectsStore.selectedProject
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewClaim)
