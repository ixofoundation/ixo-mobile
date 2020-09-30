import React, { useEffect, useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { Text } from 'native-base';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import { LocalStorageKeys } from '../models/phoneStorage';

import { useTranslation } from 'react-i18next';
import Swiper from 'react-native-swiper';
import ConnectIXO from '../screens/ConnectIXO';
import Loading from '../screens/Loading';

// styles
import OnBoardingStyles from '../styles/OnBoarding';
import { ThemeColors } from '../styles/Colors';

// assets
import logo from '../../assets/logo.png';
import makeAnImpact from '../../assets/ixoOnboarding1.mp4';

const OnBoarding = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const getData = async () => {
    //fir debug
    AsyncStorage.clear();
    try {
      const isFirstLaunch = await AsyncStorage.getItem(
        LocalStorageKeys.firstLaunch,
      );
      if (isFirstLaunch) {
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        navigation.dispatch(resetAction);
      } else {
        setShowOnboarding(true);
      }
    } catch (e) {
      setShowOnboarding(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderStepOne = () => {
    return (
      <View style={OnBoardingStyles.onboardingContainer} key={0}>
        <View style={OnBoardingStyles.logoContainer}>
          <Image
            resizeMode={'contain'}
            style={OnBoardingStyles.logo}
            source={logo}
          />
        </View>
        <Video
          resizeMode={'contain'}
          source={makeAnImpact}
          muted={true}
          playWhenInactive={false}
          playInBackground={true}
          style={OnBoardingStyles.videoStyle}
        />
        <View>
          <View>
            <Text style={OnBoardingStyles.onboardingHeading}>
              {t('onboarding:makeImpact')}
            </Text>
          </View>
          <View>
            <Text style={OnBoardingStyles.onboardingParagraph}>
              {t('onboarding:submitClaim')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStepTwo = () => {
    return (
      <View style={OnBoardingStyles.onboardingContainer} key={1}>
        <View style={OnBoardingStyles.logoContainer}>
          <Image
            resizeMode={'contain'}
            style={OnBoardingStyles.logo}
            source={logo}
          />
        </View>
        <Video
          resizeMode={'contain'}
          source={makeAnImpact}
          muted={true}
          playWhenInactive={false}
          playInBackground={true}
          style={OnBoardingStyles.videoStyle}
        />
        <View>
          <View>
            <Text style={OnBoardingStyles.onboardingHeading}>
              {t('onboarding:noConnection')}
            </Text>
          </View>
          <View>
            <Text style={OnBoardingStyles.onboardingParagraph}>
              {t('onboarding:saveClaim')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSwiperSteps = () => {
    return [renderStepOne(), renderStepTwo(), <ConnectIXO key={2} />].map(
      (element) => {
        return element;
      },
    );
  };

  return showOnboarding ? (
    <View style={OnBoardingStyles.wrapper}>
      <StatusBar barStyle="light-content" />
      <Swiper
        loop={false}
        scrollEnabled={true}
        activeDotColor={ThemeColors.blue_medium}
        dotColor={ThemeColors.blue_light}
        showsButtons={false}
        activeDotStyle={OnBoardingStyles.dotStyle}
        dotStyle={OnBoardingStyles.dotStyle}>
        {renderSwiperSteps()}
      </Swiper>
    </View>
  ) : (
    <Loading />
  );
};

export default OnBoarding;
