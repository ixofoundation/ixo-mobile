import React from 'react';
import {
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';

import DarkButton from '../components/DarkButton';
import LightButton from '../components/LightButton';

import ConnectIXOStyles from '../styles/ConnectIXO';
import ContainerStyles from '../styles/Containers';

const logo = require('../../assets/logo.png');
const globe = require('../../assets/globe.mp4');

const ConnectIXO = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnScanNavigate = () => {
    const resetAction = CommonActions.reset({
      index: 1,
      routes: [
        { name: 'ConnectIXO' },
        {
          name: 'ScanQR',
          params: { projectScan: false },
        },
      ],
    });
    navigation.dispatch(resetAction);
  };

  return (
    <View style={ConnectIXOStyles.loginWrapper}>
      <StatusBar barStyle="light-content" />
      <Video
        source={globe}
        rate={1.0}
        volume={1.0}
        muted={false}
        resizeMode={'cover'}
        repeat
        style={ConnectIXOStyles.globeView}
      />
      <View
        style={[
          ContainerStyles.flexColumn,
          { justifyContent: 'space-between' },
        ]}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Image
            resizeMode={'contain'}
            style={ConnectIXOStyles.logo}
            source={logo}
          />
        </View>
        <View style={{ width: '100%' }}>
          <LightButton
            propStyles={{ marginBottom: 10 }}
            text={t('connectIXO:registerButton')}
            onPress={() => navigation.navigate('Register')}
          />
          {Platform.OS === 'android' ? (
            <DarkButton
              text={t('connectIXO:scanButton')}
              onPress={() => handleOnScanNavigate()}
            />
          ) : null}
          <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
            <Text style={ConnectIXOStyles.recover}>
              {t('connectIXO:recover')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConnectIXO;
