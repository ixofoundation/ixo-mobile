
import { createStackNavigator } from 'react-navigation';

import OnBoarding from './src/screens/Onboarding';
import Login from './src/screens/Login';
import Projects from './src/screens/Projects';
import Claims from './src/screens/Claims';
import Loading from './src/screens/Loading';
import ConnectIXO from './src/screens/ConnectIXO';
import ConnectIXOComplete from './src/screens/ConnectIXOComplete';
import ScanQR from './src/screens/ScanQR';

const Stack = createStackNavigator({
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
  }
}, {
  initialRouteName: 'OnBoarding',
});

export default Stack;