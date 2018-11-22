import { decode as base64Decode } from 'base-64';
import { Container, Content, View } from 'native-base';
import * as React from 'react';
import { Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import DynamicForm from '../components/form/DynamicForm';
import { FormStyles } from '../models/form';
import { IClaim, IClaimSaved, IProject } from '../models/project';
import { IProjectsClaimsSaved } from '../redux/claims/claims_reducer';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { ThemeColors } from '../styles/Colors';
import { updateClaim, removeClaim } from '../redux/claims/claims_action_creators';
import { getSignature } from '../utils/sovrin';
import DoubleButton from '../components/DoubleButton';
import { showToast, toastType } from '../utils/toasts';

const { height } = Dimensions.get('window');

interface ParentProps {
	navigation: any;
	screenProps: any;
}

interface NavigationTypes {
	editable: boolean;
}

interface StateTypes {
	formFile: string | null;
	fetchedFile: any;
}

export interface DispatchProps {
	onClaimUpdate: (claimData: string, projectDID: string, claimId) => void;
	onRemoveClaim: (claimId: any, projectDid: string) => void;
}

interface StateProps {
	ixo?: any;
	savedProjectsClaims: IProjectsClaimsSaved[];
	selectedSavedClaim: IClaimSaved;
	selectedProject: IProject;
}

interface Props extends ParentProps, DispatchProps, StateProps {}
declare var dynamicForm: any;
class ViewClaim extends React.Component<Props, StateTypes> {
	private pdsURL: string = '';
	private projectDid: string = '';
	private claimFormKey: string = '';
	private claimId: string = '';
	private formFile: string = '';
	private savedClaim: IClaimSaved;
	private editable: boolean = true;
	private claimDate: Date;

	static navigationOptions = ({ navigation }: { navigation: any; }) => {
		const {
			state: { params: { impactActionTitle = 'Loading...' } = {} }
		} = navigation;
		return {
			title: impactActionTitle,
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark,
				elevation: 0
			},
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			fetchedFile: null,
			formFile: null
		};
		dynamicForm = React.createRef();

		const componentProps: NavigationTypes = this.props.navigation.state.params;
		this.editable = componentProps.editable;
	}

	componentDidMount() {
		if (this.editable) {
			// saved claim
			// @ts-ignore
			const { claims, formFile, pdsURL }: { claims: IClaimSaved[]; formFile: any; pdsURL: string } = this.props.savedProjectsClaims[
				this.props.selectedProject.projectDid
			];
			this.formFile = formFile;
			this.pdsURL = pdsURL;

			if (claims) {
				// @ts-ignore
				this.projectDid = this.props.selectedProject.projectDid;
				this.savedClaim = claims[this.props.selectedSavedClaim.claimId];
				this.claimDate = this.savedClaim.date;
				this.mergeClaimToForm(formFile, this.savedClaim.claimData);
				this.claimId = this.props.selectedSavedClaim.claimId;
			}
		} else {
			// submitted claim
			this.projectDid = this.props.selectedProject.projectDid;
			this.claimId = this.props.selectedSavedClaim.claimId;
			this.pdsURL = this.props.selectedProject.data.serviceEndpoint;
			this.claimFormKey = this.props.selectedProject.data.templates.claim.form;
			this.loadSubmittedClaim();
		}

		this.props.navigation.setParams({
			impactActionTitle: (`${this.props.selectedProject.data.impactAction} ${this.props.selectedSavedClaim.claimId}`).substring(0, 25)
		});
	}

	loadSubmittedClaim() {
		const ProjectDIDPayload: Object = { projectDid: this.projectDid };
		getSignature(ProjectDIDPayload).then((signature: any) => {
			const claimPromise: Promise<IClaim> = this.handleGetClaim(ProjectDIDPayload, signature);
			const formFilePromise: Promise<string> = this.handleFetchFile(this.claimFormKey, this.pdsURL);

			Promise.all([claimPromise, formFilePromise]).then(([claim, formFile]) => {
				this.claimDate = claim._created;
				const mergedFormFile = this.mergeClaimToForm(formFile, claim);
				this.handleFetchClaimImages(mergedFormFile, claim);
			});
		});
	}

	mergeClaimToForm(formFile: any, claim: any): string {
		const { fields = [] } = JSON.parse(formFile);
		fields.forEach((field: any) => {
			Object.assign(field, { value: claim[field.name] });
		});
		const mergedFormFile = JSON.stringify({ fields });
		this.setState({ fetchedFile: mergedFormFile });

		return mergedFormFile;
	}

	handleGetClaim = (ProjectDIDPayload: object, signature: string): Promise<IClaim> => {
		return new Promise(resolve => {
			this.props.ixo.claim.listClaimsForProject(ProjectDIDPayload, signature, this.pdsURL).then((response: any) => {
				if (response.error) {
					// Toast.errorToast(response.error.message, ErrorTypes.goBack);
				} else {
					const claimFound = response.result.filter((claim: IClaim) => claim.txHash === this.claimId)[0];
					return resolve(claimFound);
				}
			});
		});
	}

	handleFetchFile = (claimFormKey: string, pdsURL: string): Promise<string> => {
		return new Promise(resolve => {
			this.props.ixo.project
				.fetchPublic(claimFormKey, pdsURL)
				.then((res: any) => {
					const fileContents = base64Decode(res.data);
					return resolve(fileContents);
				})
				.catch((error: Error) => {
					console.log(error);
				});
		});
	}

	onSaveClaim = (claimData: any) => {
		if (this.projectDid) {
			this.props.onClaimUpdate(claimData, this.projectDid, this.claimId);
			this.props.navigation.pop();
		}
	}

	handleSubmitClaim = (claimData: any) => {
		const claimPayload = {...claimData};
		claimPayload['projectDid'] = this.projectDid;

		getSignature(claimPayload)
			.then((signature: any) => {
				this.props.ixo.claim
					.createClaim(claimPayload, signature, this.pdsURL)
					.then(() => {
						this.props.onRemoveClaim(this.claimId, this.projectDid);
						this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: true });
					})
					.catch(() => {
						this.props.navigation.navigate('SubmittedClaims', { claimSubmitted: false });
					});
			})
			.catch((error: Error) => {
				console.log(error);
				showToast(this.props.screenProps.t('claims:signingFailed'), toastType.DANGER);
			});
	}

	handleRemoveClaim = () => {
		this.props.onRemoveClaim(this.claimId, this.projectDid)
		this.props.navigation.pop();
	}

	handleFetchClaimImages = (mergedFormFile: any, claim: any) => {
		const { fields = [] } = JSON.parse(mergedFormFile);
		const promises: any = [];
		fields.forEach((field: any) => {
			if (field.type === 'image') {
				promises.push(
					this.props.ixo.project.fetchPublic(claim[field.name], this.pdsURL).then((res: any) => {
						const imageSrc = `data:${res.contentType};base64,${res.data}`;
						field.value = imageSrc;
						this.setState({ fetchedFile: JSON.stringify({ fields }) });
					})
				);
			}
		});
		Promise.all(promises);
	}

	renderForm() {
		const claimParsed = JSON.parse(this.state.fetchedFile!);
		if (this.state.fetchedFile) {
			return (
				<DynamicForm
					ref={dynamicForm}
					handleSave={data => this.onSaveClaim(data)}
					handleSubmit={data => this.handleSubmitClaim(data)}
					handleRemove={() => this.handleRemoveClaim()}
					claimDate={this.claimDate}
					editMode={this.editable}
					screenProps={this.props.screenProps}
					formSchema={claimParsed.fields}
					formStyle={FormStyles.standard}
				/>
			);
		} else {
			return <ActivityIndicator color={ThemeColors.blue_light} />;
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.grey_sync, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle="light-content" />
				<View style={{ height: height * 0.18, backgroundColor: ThemeColors.blue_dark, paddingHorizontal: '3%', paddingTop: '2%' }} />
				<View style={[{ position: 'absolute', height: height - 100, top: 30, alignSelf: 'center', width: '95%' }]}>
					<Content>{this.renderForm()}</Content>
				</View>
				{this.editable ? (
					<DoubleButton text={'SAVE'} secondText={'SUBMIT'} onPress={() => dynamicForm.current.handleSave()} secondOnPress={() => dynamicForm.current.handleSubmit()} />
				) : null}
			</Container>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onClaimUpdate: (claimData: string, projectDID: string, claimId: string) => {
			dispatch(updateClaim(claimData, projectDID, claimId));
		},
		onRemoveClaim: (claimId: any, projectDid: string) => {
			dispatch(removeClaim(claimId, projectDid));
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims,
		selectedSavedClaim: state.claimsStore.selectedSavedClaim,
		selectedProject: state.projectsStore.selectedProject
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewClaim);
