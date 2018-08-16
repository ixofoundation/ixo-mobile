import React from 'react';
import { StatusBar } from 'react-native';
import { Container, Icon, Content, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { ThemeColors } from '../styles/Colors';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { IUser } from '../models/user';
import { decode as base64Decode } from 'base-64';
import DynamicForm from '../components/form/DynamicForm';
import { FormStyles } from '../models/form';
import LoadingScreen from './Loading';

interface PropTypes {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

interface State {
	formFile: string | null;
	fetchedFile: any;
}

export interface StateProps {
	ixo?: any;
	user?: IUser;
}
export interface Props extends PropTypes, StateProps {}

class NewClaim extends React.Component<Props, State> {
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

	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="close" onPress={() => props.navigation.pop()} style={{ paddingLeft: 10 }} />,
			title: 'New',
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
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
		const claimParsed = JSON.parse(this.state.fetchedFile);
		if (this.state.fetchedFile) {
			return <DynamicForm formSchema={claimParsed.fields} formStyle={FormStyles.standard} handleSubmit={this.onFormSubmit} />;
		} else {
			return <Spinner color={ThemeColors.blue_light} />;
		}
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.white }}>
				<StatusBar barStyle="dark-content" />
				<Content contentContainerStyle={{ padding: 20, flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
					{this.renderForm()}
				</Content>
			</Container>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user
	};
}

export default connect(mapStateToProps)(NewClaim);
