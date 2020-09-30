import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Toast } from 'native-base';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import SInfo from 'react-native-sensitive-info';
import { SecureStorageKeys } from '../models/phoneStorage';
import { showToast, toastType } from '../utils/toasts';

import { userSetPassword } from '../redux/user/actions';

import CustomIcon from '../components/svg/CustomIcons';
import InputField from '../components/InputField';
import DarkButton from '../components/DarkButton';

// styles
import LoginStyles from '../styles/Login';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';

// assets
import logo from '../../assets/logo.png';
import globe from '../../assets/globe.mp4';
import IconFingerprint from '../../assets/iconFingerprint.png';

const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.userStore);

  const [password, setPassword] = useState('');
  const [revealPassword, setRevealPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const scanFingerprint = async () => {};

  const showAndroidAlert = () => {
    Alert.alert(
      'Fingerprint Scan',
      'Place your finger over the touch sensor and press scan.',
      [
        {
          text: 'Scan',
          onPress: () => {
            scanFingerprint();
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel'),
          style: 'cancel',
        },
      ],
    );
  };

  const callRevealPassword = () => {
    setRevealPassword(!revealPassword);
  };

  const signIn = () => {
    setLoading(true);

    SInfo.getItem(SecureStorageKeys.password, {})
      .then((newPassword) => {
        // get phone password from secure store
        if (newPassword === password) {
          const gotoProjects = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Projects' }],
          });
          navigation.dispatch(gotoProjects);
        } else {
          Toast.show({
            text: t('login:wrongPassword'),
            buttonText: 'OK',
            type: 'warning',
            position: 'top',
          });
          setLoading(false);
        }
      })
      .catch(() => {
        Toast.show({
          text: t('login:loginFailed'),
          buttonText: 'OK',
          type: 'warning',
          position: 'top',
        });
        setLoading(false);
      });
  };

  const callSetPassword = () => {
    if (password.length < 8) {
      showToast(t('register:passwordShort'), toastType.WARNING);
      return;
    }

    SInfo.setItem(SecureStorageKeys.password, password, {});
    userSetPassword();
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Projects' }],
    });
    navigation.dispatch(resetAction);
  };

  const renderExistingUser = () => {
    return (
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={Platform.OS === 'ios'}>
        <View style={[ContainerStyles.flexRow, LoginStyles.logoContainer]}>
          <Image
            resizeMode={'contain'}
            style={LoginStyles.logo}
            source={logo}
          />
        </View>
        <InputField
          containerStyle={{ flex: 0.1, marginBottom: 30 }}
          prefixIcon={<CustomIcon name="lock" style={LoginStyles.inputIcons} />}
          suffixIcon={
            <TouchableOpacity onPress={() => callRevealPassword()}>
              <CustomIcon name="eyeoff" style={LoginStyles.inputIcons} />
            </TouchableOpacity>
          }
          underlinePositionRatio={0.03}
          labelName={t('login:password')}
          onChangeText={(newPassword) => setPassword(newPassword)}
          password={revealPassword}
        />
        <View style={[{ flex: 0.2 }]}>
          {loading ? (
            <ActivityIndicator color={ThemeColors.blue_medium} />
          ) : (
            <DarkButton text={t('login:signIn')} onPress={() => signIn()} />
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Recover')}>
          <Text style={LoginStyles.recover}>{t('login:recover')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ContainerStyles.flexRow, { flex: 0.1, marginVertical: 20 }]}
          onPress={() =>
            Platform.OS === 'android' ? showAndroidAlert() : scanFingerprint()
          }>
          <Image
            resizeMode={'contain'}
            style={LoginStyles.fingerImage}
            source={IconFingerprint}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  };

  const renderNewUser = () => {
    return (
      <KeyboardAvoidingView
        behavior={'position'}
        enabled={Platform.OS === 'ios'}
        style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[LoginStyles.flexLeft]}>
          <Text style={LoginStyles.header}>
            {t('login:hi')} {userName}
          </Text>
        </View>
        <View style={{ width: '100%' }}>
          <View style={LoginStyles.divider} />
        </View>
        {!userStore.isLoginPasswordSet && (
          <View style={LoginStyles.flexLeft}>
            <Text style={LoginStyles.infoBox}>{t('login:attention')} </Text>
          </View>
        )}
        <View style={LoginStyles.flexLeft}>
          <Text style={[LoginStyles.infoBoxLong]}>{t('login:secure')} </Text>
        </View>
        <InputField
          containerStyle={{ flex: 0.3, marginBottom: 30 }}
          prefixIcon={<CustomIcon name="lock" style={LoginStyles.inputIcons} />}
          suffixIcon={
            <CustomIcon name="eyeoff" style={LoginStyles.inputIcons} />
          }
          onSuffixImagePress={callRevealPassword}
          underlinePositionRatio={0.03}
          labelName={t('login:createPassword')}
          onChangeText={(newPassword) => setPassword(newPassword)}
          password={revealPassword}
        />

        {loading ? (
          <ActivityIndicator color={ThemeColors.blue_medium} />
        ) : (
          <DarkButton
            text={t('login:signIn')}
            onPress={() => callSetPassword()}
          />
        )}
      </KeyboardAvoidingView>
    );
  };

  return (
    <View style={[LoginStyles.wrapper, { backgroundColor: '#0c2938' }]}>
      <Video
        source={globe}
        rate={1.0}
        volume={1.0}
        muted={false}
        resizeMode={'cover'}
        repeat
        style={LoginStyles.globeView}
      />
      <View style={[ContainerStyles.flexColumn]}>
        <StatusBar
          backgroundColor={ThemeColors.blue_dark}
          barStyle="light-content"
        />
        {userStore.isLoginPasswordSet ? renderExistingUser() : renderNewUser()}
      </View>
    </View>
  );
};

export default Login;
