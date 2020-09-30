import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ConnectIXO from './screens/ConnectIXO';
import LoadingScreen from './screens/Loading';
import OnBoarding from './screens/Onboarding';
import Recover from './screens/Recover';
import Register from './screens/Register';
import ScanQR from './screens/ScanQR';
import Login from './screens/Login';
import Projects from './screens/Projects';

import SideBar from './components/SideBar';
import SubmittedClaims from './screens/SubmittedClaims';
import NewClaim from './screens/NewClaim';
import ProjectDetails from './screens/ProjectDetails';
import Claims from './screens/Claims';
import ViewClaim from './screens/ViewClaim';
import Help from './screens/Help';

const AppNavigator = createStackNavigator();

function appNavigatorStack() {
  return (
    <AppNavigator.Navigator initialRouteName="Projects">
      <AppNavigator.Screen name="Projects" component={Projects} />
      <AppNavigator.Screen name="SubmittedClaims" component={SubmittedClaims} />
      <AppNavigator.Screen name="NewClaim" component={NewClaim} />
      <AppNavigator.Screen name="ProjectDetails" component={ProjectDetails} />
      <AppNavigator.Screen name="Claims" component={Claims} />
      <AppNavigator.Screen name="ViewClaim" component={ViewClaim} />
    </AppNavigator.Navigator>
  );
}

const HelpNavigator = createStackNavigator();

function helpNavigatorStack() {
  return (
    <HelpNavigator.Navigator initialRouteName="Help">
      <HelpNavigator.Screen name="Help" component={Help} />
    </HelpNavigator.Navigator>
  );
}

const DrawerNavigator = createDrawerNavigator();

function drawerNavigatorStack() {
  return (
    <DrawerNavigator.Navigator initialRouteName="Drawer" component={SideBar}>
      <DrawerNavigator.Screen name="Drawer" component={appNavigatorStack} />
      <DrawerNavigator.Screen name="Help" component={helpNavigatorStack} />
    </DrawerNavigator.Navigator>
  );
}

const OnBoardingNavigator = createStackNavigator();

function OnBoardingNavigatorStack() {
  return (
    <OnBoardingNavigator.Navigator initialRouteName="OnBoarding">
      <OnBoardingNavigator.Screen
        name="ConnectIXO"
        component={ConnectIXO}
        options={{ headerShown: false }}
      />
      <OnBoardingNavigator.Screen
        name="OnBoarding"
        component={OnBoarding}
        options={{ headerShown: false }}
      />
      <OnBoardingNavigator.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <OnBoardingNavigator.Screen
        name="Projects"
        component={drawerNavigatorStack}
        options={{ headerShown: false }}
      />
      <OnBoardingNavigator.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <OnBoardingNavigator.Screen name="ScanQR" component={ScanQR} />
      <OnBoardingNavigator.Screen name="Register" component={Register} />
      <OnBoardingNavigator.Screen name="Recover" component={Recover} />
    </OnBoardingNavigator.Navigator>
  );
}

export default function MainNavigatorStack() {
  return (
    <NavigationContainer>
      <OnBoardingNavigatorStack />
    </NavigationContainer>
  );
}
