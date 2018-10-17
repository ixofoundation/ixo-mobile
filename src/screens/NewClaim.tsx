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
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import { connect } from 'react-redux';
import { getSignature } from '../utils/sovrin';

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface StateTypes {
	isLastCard: boolean;
}

export interface DispatchProps {
	onClaimSave: (claim: string, projectDID: string) => void;
}

export interface StateProps {
	ixo?: any;
	project?: IProject;
	savedProjectsClaims: IProjectsClaimsSaved[];
}
export interface Props extends ParentProps, DispatchProps, StateProps {}

declare var dynamicForm: any;
class NewClaim extends React.Component<Props, StateTypes> {
	private pdsURL: string = '';
	private projectDid: string | undefined;
	private projectName: string = '';
	private projectFormFile: string = '';

	constructor(props: Props) {
		super(props);
		this.state = {
			isLastCard: false
		};
		dynamicForm = React.createRef();

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
				<TouchableOpacity onPress={() => onSave()}>
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
	}

	componentDidMount() {
		this.props.navigation.setParams({
			projectName: this.projectName,
			saveText: this.props.screenProps.t('claims:saveClaim'),
			onSave: () => dynamicForm.current.handleSave()
		});
	}

	onToggleLastCard = (active: boolean) => {
		this.setState({ isLastCard: active });
	}

	handleSubmitClaim = (claimData: any) => {
		const claimPayload = Object.assign(claimData);
		claimPayload['projectDid'] = this.projectDid;

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
				Toast.show({
					text: this.props.screenProps.t('claims:signingFailed'),
					buttonText: 'OK',
					type: 'danger',
					position: 'top'
				});
			});
	}

	onSaveClaim = (claimData: any) => {
		if (this.projectDid) {
			this.props.onClaimSave(claimData, this.projectDid);
			this.props.navigation.pop();
		}
	}

	onFormSubmit = (formData: any) => {
		// upload all the images and change the value to the returned hash of the image
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
	}

	renderForm() {
		const claimParsed = JSON.parse(this.projectFormFile!);
		if (this.projectFormFile) {
			return (
				<DynamicSwiperForm
					ref={dynamicForm}
					screenProps={this.props.screenProps}
					formSchema={claimParsed.fields}
					formStyle={FormStyles.standard}
					handleSubmit={this.onFormSubmit}
					handleSave={this.onSaveClaim}
					onToggleLastCard={this.onToggleLastCard}
				/>
			);
		} else {
			return <ActivityIndicator color={ThemeColors.white} />;
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
		onClaimSave: (claim: string, projectDID: string) => {
			dispatch(saveClaim(claim, projectDID));
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		project: state.projectsStore.selectedProject,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewClaim);
