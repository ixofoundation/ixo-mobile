import { createStackNavigator, createDrawerNavigator, StackNavigator } from 'react-navigation';

import OnBoarding from './screens/Onboarding';
import Login from './screens/Login';
import Projects from './screens/Projects';
import Claims from './screens/Claims';
import Loading from './screens/Loading';
import ConnectIXO from './screens/ConnectIXO';
import ConnectIXOComplete from './screens/ConnectIXOComplete';
import ScanQR from './screens/ScanQR';
import ProjectDetails from './screens/ProjectDetails';
import NewClaim from './screens/NewClaim';
import SubmittedClaims from './screens/SubmittedClaims';
import Settings from './screens/Settings';
import Help from './screens/Help';
import Register from './screens/Register';
import ViewClaim from './screens/ViewClaim';
import SideBar from './components/SideBar';
import Recover from './screens/Recover';

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

// const SettingsNavigator = createStackNavigator(
// 	{
// 		Settings: { screen: Settings },
// 		OnBoarding: {
// 			screen: OnBoarding,
// 			navigationOptions: {
// 				header: null
// 			}
// 		},
// 		ConnectIXO: {
// 			screen: ConnectIXO,
// 			navigationOptions: {
// 				header: null
// 			}
// 		}
// 	},
// 	{
// 		initialRouteName: 'Settings'
// 	}
// );

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
		// Settings: { screen: SettingsNavigator },
		Help: { screen: HelpNavigator }
	},
	{
		initialRouteName: 'Drawer',
		contentComponent: SideBar
	}
);

const OnBoardingNavigator = createStackNavigator(
	{
		Settings: { screen: Settings },
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
			screen: Recover
		}
	},
	{
		initialRouteName: 'OnBoarding'
	}
);

export default OnBoardingNavigator;
