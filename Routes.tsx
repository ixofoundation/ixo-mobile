import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import OnBoarding from './src/screens/Onboarding';
import Login from './src/screens/Login';
import Projects from './src/screens/Projects';
import Claims from './src/screens/Claims';
import Loading from './src/screens/Loading';
import ConnectIXO from './src/screens/ConnectIXO';
import ConnectIXOComplete from './src/screens/ConnectIXOComplete';
import ScanQR from './src/screens/ScanQR';
import ProjectDetails from './src/screens/ProjectDetails';
import NewClaim from './src/screens/NewClaim';
import SubmittedClaims from './src/screens/SubmittedClaims';
import Settings from './src/screens/Settings';
import Help from './src/screens/Help';
import Register from './src/screens/Register';
import ViewClaim from './src/screens/ViewClaim';
import SideBar from './src/components/SideBar';
import Recover from './src/screens/Recover';

const AppNavigator = createStackNavigator(
	{
		Projects: {
			screen: Projects
		},
		SubmittedClaims: {
			screen: SubmittedClaims
		},
		NewClaim: {
			screen: NewClaim
		},
		ProjectDetails: {
			screen: ProjectDetails
		},
		Claims: {
			screen: Claims
		},
		ViewClaim: {
			screen: ViewClaim
		}
	},
	{
		initialRouteName: 'Projects'
	}
);

const SettingsNavigator = createStackNavigator(
	{
		Settings: { screen: Settings },
		OnBoarding: {
			screen: OnBoarding,
			navigationOptions: {
				header: null
			}
		},
		ConnectIXO: {
			screen: ConnectIXO,
			navigationOptions: {
				header: null
			}
		}
	},
	{
		initialRouteName: 'Settings'
	}
);

const HelpNavigator = createStackNavigator(
	{
		Help: { screen: Help }
	},
	{
		initialRouteName: 'Help'
	}
);

const DrawerNavigator = createDrawerNavigator(
	{
		Drawer: { screen: AppNavigator },
		Settings: { screen: SettingsNavigator },
		Help: { screen: HelpNavigator }
	},
	{
		initialRouteName: 'Drawer',
		contentComponent: SideBar
	}
);

const OnBoardingNavigator = createStackNavigator(
	{
		ConnectIXO: {
			screen: ConnectIXO,
			navigationOptions: {
				header: null
			}
		},
		OnBoarding: {
			screen: OnBoarding,
			navigationOptions: {
				header: null
			}
		},
		Login: {
			screen: Login,
			navigationOptions: {
				header: null
			}
		},
		Projects: {
			screen: DrawerNavigator,
			navigationOptions: {
				header: null
			}
		},
		Loading: {
			screen: Loading,
			navigationOptions: {
				header: null
			}
		},
		ScanQR: {
			screen: ScanQR
		},
		ConnectIXOComplete: {
			screen: ConnectIXOComplete,
			navigationOptions: {
				header: null
			}
		},
		Register: {
			screen: Register
		},
		Recover: {
			screen: Recover,
		},
	},
	{
		initialRouteName: 'OnBoarding'
	}
);

export default OnBoardingNavigator;
