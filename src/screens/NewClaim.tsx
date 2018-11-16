import * as React from 'react';
import _ from 'underscore';
import { StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, View, Toast, Text, Icon } from 'native-base';
import { ThemeColors } from '../styles/Colors';
import { IProject } from '../models/project';
import NewClaimStyles from '../styles/NewClaim';
import DynamicSwiperForm from '../components/form/DynamicSwiperForm';
import { FormStyles } from '../models/form';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { saveClaim } from '../redux/claims/claims_action_creators';
import { dynamicSetFormCardIndex } from '../redux/dynamics/dynamics_action_creators';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import { connect } from 'react-redux';
import { getSignature } from '../utils/sovrin';
import { showToast, toastType } from '../utils/toasts';

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface StateTypes {
	claimData: string;
}

export interface DispatchProps {
	onSetFormCardIndex: (index: number) => void;
	onClaimSave: (claim: string, projectDID: string) => void;
}

export interface StateProps {
	ixo?: any;
	project?: IProject;
	savedProjectsClaims: IProjectsClaimsSaved[];
	online: boolean;
	dynamicFormIndex: number;
}
export interface Props extends ParentProps, DispatchProps, StateProps {}
class NewClaim extends React.Component<Props, StateTypes> {
	private pdsURL: string = '';
	private projectDid: string | undefined;
	private projectName: string = '';
	private projectFormFile: string = '';
	private formLength: number = 0;
	private isClaimSaved: boolean = false;

	constructor(props: Props) {
		super(props);
		this.state = {
			claimData: ''
		};

		if (props.project) {
			this.pdsURL = props.project.data.serviceEndpoint;
			this.projectDid = props.project.projectDid;
			this.projectName = props.project.data.title;
			const projectsSavedClaims = _.find(this.props.savedProjectsClaims, (claim: IProjectsClaimsSaved) => claim.projectDid === this.projectDid);
			this.projectFormFile = projectsSavedClaims && projectsSavedClaims.formFile;
		}
	}

	static navigationOptions = ({ navigation }: { navigation: any }) => {
		const {
			state: { params: { projectName = 'Loading...', saveText = '', onSave = null } = {} }
		} = navigation;
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark,
				elevation: 0
			},
			title: projectName,
			headerRight: (
				<TouchableOpacity
					onPress={() => {
						onSave();
					}}
				>
					<Text style={NewClaimStyles.headerSaveButton}>{saveText}</Text>
				</TouchableOpacity>
			),
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	};

	componentDidMount() {
		this.props.navigation.setParams({
			projectName: this.projectName,
			saveText: this.props.screenProps.t('claims:saveClaim'),
			onSave: () => this.handleSaveClaim()
		});
	}

	handleUserFilledClaim = (userFilledData: string) => {
		this.setState({ claimData: userFilledData });
	};

	handleSaveClaim = () => {
		if (this.projectDid && !this.isClaimSaved) {
			this.isClaimSaved = true;
			this.props.navigation.pop();
			this.props.onClaimSave(this.state.claimData, this.projectDid);
		}
	};

	getLocation() {
		
	}

	handleSubmitClaim = (claimData: any) => {
		const claimPayload = Object.assign(claimData);
		claimPayload['projectDid'] = this.projectDid;

		const getLocation = await getLocation();
		claimPayload['_claimLocation'] = 

		if (this.props.online) {
			getSignature(claimPayload)
				.then((signature: any) => {
					this.props.ixo.claim
						.createClaim(claimPayload, signature, this.pdsURL)
						.then(() => {
							this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: true });
						})
						.catch(() => {
							this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: false });
						});
				})
				.catch((error: Error) => {
					console.log(error);
					showToast('claims:signingFailed', toastType.DANGER);
				});
		} else {
			showToast(this.props.screenProps.t('claims:noInternet'), toastType.WARNING);
		}
	};

	onFormSubmit = () => {
		// upload all the images and change the value to the returned hash of the image
		const formData = this.state.claimData;
		const formDef = JSON.parse(this.projectFormFile);
		const promises: Promise<any>[] = [];
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
		Promise.all(promises).then(() => {
			this.handleSubmitClaim(formData);
		});
	};

	renderForm() {
		const claimParsed = JSON.parse(this.projectFormFile!);
		this.formLength = claimParsed.fields.length;
		if (this.projectFormFile) {
			return (
				<DynamicSwiperForm
					screenProps={this.props.screenProps}
					formSchema={claimParsed.fields}
					handleUserFilledClaim={this.handleUserFilledClaim}
					formStyle={FormStyles.standard}
					navigation={this.props.navigation}
				/>
			);
		} else {
			return <ActivityIndicator color={ThemeColors.white} />;
		}
	}

	buildButton(isLeftButton: boolean): JSX.Element {
		const button: JSX.Element[] = [];

		if (isLeftButton) {
			if (this.props.dynamicFormIndex !== 0) {
						button.push(<Icon style={{ color: ThemeColors.blue_light, fontSize: 23 }} name="arrow-back" />);
						button.push(<Text style={NewClaimStyles.backNavigatorButton}>{this.props.screenProps.t('claims:back')}</Text>);
			}
		} else {
			if (this.props.dynamicFormIndex < this.formLength - 1) {
				button.push(<Text style={NewClaimStyles.nextNavigatorButton}>{this.props.screenProps.t('claims:next')}</Text>);
				button.push(<Icon style={{ color: ThemeColors.white, fontSize: 23 }} name="arrow-forward" />);
			}
			if (this.props.dynamicFormIndex === this.formLength - 1) {
				button.push(<Text style={NewClaimStyles.nextNavigatorButton}>{this.props.screenProps.t('claims:submitClaim')}</Text>);
			}
		}
		return (
			<TouchableOpacity onPress={() => this.getActionFunction(isLeftButton)} style={NewClaimStyles.actionButtonWrapper}>
				{button.map(element => {
					return element;
				})}
			</TouchableOpacity>
		);
	}

	getActionFunction = (isLeftButton: boolean) => {
		if (this.props.dynamicFormIndex < this.formLength - 1 && !isLeftButton) { // next button
			return this.props.onSetFormCardIndex(this.props.dynamicFormIndex + 1);
		}
		if (this.props.dynamicFormIndex !== 0 && isLeftButton) { // back button
			return this.props.onSetFormCardIndex(this.props.dynamicFormIndex - 1);
		}
		if (this.props.dynamicFormIndex === this.formLength - 1) { // submit button
			this.onFormSubmit();
		}
		return null;
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.blue_dark, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle="light-content" />
				{this.renderForm()}
				<View style={NewClaimStyles.navigatorContainer}>
					{this.buildButton(true)}
					{this.buildButton(false)}
				</View>
			</Container>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onSetFormCardIndex: (formCardIndex: number) => {
			dispatch(dynamicSetFormCardIndex(formCardIndex));
		},
		onClaimSave: (claim: string, projectDID: string) => {
			dispatch(saveClaim(claim, projectDID));
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		project: state.projectsStore.selectedProject,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims,
		online: state.dynamicsStore.online,
		dynamicFormIndex: state.dynamicsStore.dynamicFormIndex
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewClaim);
