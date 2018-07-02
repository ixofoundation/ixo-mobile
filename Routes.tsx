
import { createStackNavigator } from 'react-navigation';

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
import Notification from './src/screens/Notifications';
import Privacy from './src/screens/Privacy';
import Help from './src/screens/Help';

const Stack = createStackNavigator({
  SubmittedClaims: {
    screen: SubmittedClaims,
  },
  NewClaim: {
    screen: NewClaim
  },
  ProjectDetails: {
    screen: ProjectDetails,
  },
  ConnectIXO: { screen: ConnectIXO,
    navigationOptions: {
      header: null,
    }
  },
  OnBoarding: { screen: OnBoarding,
    navigationOptions: {
      header: null,
    }
  },
  Login: { screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  Projects: { screen: Projects,
  },
  Claims: { screen: Claims,
  },
  Loading: { screen: Loading,
    navigationOptions: {
      header: null,
    }
  },
  ScanQR: { screen: ScanQR
  },
  ConnectIXOComplete: { screen: ConnectIXOComplete,
    navigationOptions: {
      header: null,
    }
  },
  Settings: { screen: Settings,
  },
  Notifications: { screen: Notification,
  },
  Privacy: { screen: Privacy,
  },
  Help: { screen: Help,
  },
}, {
  initialRouteName: 'OnBoarding',
});

export default Stack;