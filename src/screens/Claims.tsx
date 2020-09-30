import React from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {
  Container,
  Content,
  Tab,
  Tabs,
  TabHeading,
  Text,
  View,
} from 'native-base';

import DarkButton from '../components/DarkButton';
import LightButton from '../components/LightButton';

//styles
import { ThemeColors, ClaimsButton } from '../styles/Colors';

const Claims = () => {
  const projectClaims = this.props.savedProjectsClaims[this.projectDid];
  const numberOfSavedClaims =
    projectClaims && projectClaims.claims
      ? Object.keys(projectClaims.claims).length
      : 0;
  return (
    <Container>
      {this.renderConnectivity()}
      <StatusBar barStyle="light-content" />
      <Tabs
        style={{ backgroundColor: ThemeColors.blue_dark }}
        tabBarUnderlineStyle={{
          backgroundColor: ThemeColors.blue_lightest,
          height: 1,
        }}
        tabContainerStyle={{
          borderBottomColor: ThemeColors.blue,
          elevation: 0,
          borderBottomWidth: 1,
        }}>
        <Tab
          activeTabStyle={{ backgroundColor: ThemeColors.blue_dark }}
          tabStyle={{ backgroundColor: ThemeColors.blue_dark }}
          heading={this.renderSavedTab(numberOfSavedClaims)}>
          {this.props.isClaimsSubmitted
            ? this.renderAllSavedClaimsSubmitted()
            : this.renderSavedClaims(projectClaims)}
        </Tab>
        <Tab
          activeTabStyle={{ backgroundColor: ThemeColors.blue_dark }}
          tabStyle={{ backgroundColor: ThemeColors.blue_dark }}
          heading={this.props.screenProps.t('claims:submitted')}>
          {this.renderSubmittedClaims()}
        </Tab>
      </Tabs>
      {this.props.firstTimeClaim ? (
        <LightButton
          propStyles={{
            backgroundColor: ThemeColors.red,
            borderColor: ThemeColors.red,
            borderRadius: 0,
          }}
          onPress={() => {
            this.props.navigation.navigate('NewClaim');
          }}
          text={this.props.screenProps.t('claims:submitButton')}
        />
      ) : (
        <DarkButton
          onPress={() => this.props.navigation.navigate('NewClaim')}
          text={this.props.screenProps.t('claims:submitButton')}
        />
      )}
    </Container>
  );
};

export default Claims;
