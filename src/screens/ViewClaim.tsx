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
import NewClaimStyles from '../styles/NewClaim';
import { getSignature } from '../utils/sovrin';
import DoubleButton from '../components/DoubleButton';

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

interface StateProps {
	ixo?: any;
	savedProjectsClaims: IProjectsClaimsSaved[];
	selectedSavedClaim: IClaimSaved;
	selectedProject: IProject;
}

interface Props extends ParentProps, StateProps {}

class ViewClaim extends React.Component<Props, StateTypes> {
	private pdsURL: string = '';
	private projectDid: string = '';
	private claimFormKey: string = '';
	private claimId: string = '';
	private formFile: string = '';
	private editable: boolean = true;
	// private savedClaim: IClaimSaved = { claimId: '', claimData: '', date: undefined };
	// private savedProject: IProjectsClaimsSaved = 

	static navigationOptions = () => {
		return {
			headerStyle: {
				backgroundColor: ThemeColors.blue_dark,
				borderBottomColor: ThemeColors.blue_dark
			},
			headerTitleStyle: {
				color: ThemeColors.white,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.white
		};
	}

	constructor(props: Props) {
		super(props);
		this.state = {
			fetchedFile: null,
			formFile: null
		};

		const componentProps: NavigationTypes = this.props.navigation.state.params;
		this.editable = componentProps.editable;
	}

	componentDidMount() {
		if (this.editable) { // saved claim
			// @ts-ignore
			const { claims, formFile, pdsURL }: { claims: IClaimSaved[]; formFile: any, pdsURL: string } = this.props.savedProjectsClaims[this.props.selectedProject.projectDid];
			this.formFile = formFile;
			this.pdsURL = pdsURL;

			if (claims) {
				// @ts-ignore
				const claim: IClaimSaved = claims[this.props.selectedSavedClaim.claimId];
				this.mergeClaimToForm(formFile, claim.claimData);
			}
		} else { // submitted claim
			this.projectDid = this.props.selectedProject.projectDid;
			this.claimId = this.props.selectedSavedClaim.claimId;
			this.pdsURL = this.props.selectedProject.data.serviceEndpoint;
			this.claimFormKey = this.props.selectedProject.data.templates.claim.form;
			this.loadSubmittedClaim();
		}
	}

	loadSubmittedClaim() {
		const ProjectDIDPayload: Object = { projectDid: this.projectDid };
		getSignature(ProjectDIDPayload).then((signature: any) => {
			const claimPromise: Promise<any> = this.handleGetClaim(ProjectDIDPayload, signature);
			const formFilePromise: Promise<any> = this.handleFetchFile(this.claimFormKey, this.pdsURL);

			Promise.all([claimPromise, formFilePromise]).then(([claim, formFile]) => {
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

	handleGetClaim = (ProjectDIDPayload: object, signature: string) => {
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

	handleFetchFile = (claimFormKey: string, pdsURL: string) => {
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
			return <DynamicForm screenProps={this.props.screenProps} formSchema={claimParsed.fields} formStyle={FormStyles.standard} />;
		} else {
			return <ActivityIndicator color={ThemeColors.blue_light} />;
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.grey_sync, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
				<StatusBar barStyle='light-content' />
				<View style={{ height: height * 0.18, backgroundColor: ThemeColors.blue_dark, paddingHorizontal: '3%', paddingTop: '2%' }} />
				<View style={[NewClaimStyles.formContainer, { position: 'absolute', height: height - 100, top: 30, alignSelf: 'center', width: '95%' }]}>
					<Content style={{ paddingHorizontal: 10 }}>{this.renderForm()}</Content>
				</View>
				{this.editable ? (
					<DoubleButton text={'SAVE'} secondText={'SUBMIT'} onPress={() => console.log('test')} secondOnPress={() => console.log('test2')} />
				) : null}
			</Container>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims,
		selectedSavedClaim: state.claimsStore.selectedSavedClaim,
		selectedProject: state.projectsStore.selectedProject
	};
}

export default connect(mapStateToProps)(ViewClaim);
