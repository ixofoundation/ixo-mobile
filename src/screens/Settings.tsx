import { Container, Content, Icon } from 'native-base';
import * as React from 'react';
import { StatusBar, AsyncStorage } from 'react-native';
import { ThemeColors } from '../styles/Colors';
import DarkButton from '../components/DarkButton';
import { connect } from 'react-redux';
import { PublicSiteStoreState } from '../redux/public_site_reducer';
import { clearClaim, clearFileForm, clearSelected } from '../redux/claims/claims_action_creators';
import { clearProject, clearProjects } from '../redux/projects/projects_action_creators';
import { clearUser } from '../redux/user/user_action_creators';
import { StackActions, NavigationActions } from 'react-navigation';

interface DispatchProps {
	onClearAll: () => void;
}

interface ParentProps {
	navigation: any;
}

interface NavigationTypes {
	navigation: any;
}

export interface Props extends ParentProps, DispatchProps {}

class Settings extends React.Component<Props> {
	static navigationOptions = (props: NavigationTypes) => {
		return {
			headerLeft: <Icon name="close" onPress={() => props.navigation.navigate('Drawer')} style={{ paddingLeft: 10 }} />,
			title: 'Settings',
			headerTitleStyle: {
				color: ThemeColors.black,
				textAlign: 'center',
				alignSelf: 'center'
			},
			headerTintColor: ThemeColors.black
		};
	};

	resetAccount() {
		// AsyncStorage.clear();
		this.props.onClearAll();
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'OnBoarding' })]
		});
		this.props.navigation.dispatch(resetAction);
	}

	render() {
		return (
			<Container style={{ backgroundColor: ThemeColors.white }}>
				<StatusBar barStyle="dark-content" />
				<Content contentContainerStyle={{ backgroundColor: ThemeColors.white, padding: 20 }}>
					{(__DEV__) ? <DarkButton text="Reset Account" onPress={() => this.resetAccount()} /> : null}
				</Content>
			</Container>
		);
	}
}

function mapDispatchToProps(dispatch: any): DispatchProps {
	return {
		onClearAll: () => {
			dispatch(clearFileForm());
			dispatch(clearSelected());
			dispatch(clearClaim());
			dispatch(clearProject());
			dispatch(clearProjects());
			dispatch(clearUser());
		}
	};
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		user: state.userStore.user,
		firstTimeClaim: state.userStore.isFirstClaim,
		project: state.projectsStore.selectedProject,
		savedProjectsClaims: state.claimsStore.savedProjectsClaims,
		online: state.dynamicsStore.online
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Settings);
