import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { initIxo } from '../redux/ixo/actions';
import { initUser } from '../redux/user/actions';
import { Container, Icon, Text, View, Content } from 'native-base';
import SInfo from 'react-native-sensitive-info';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';

import { env } from '../config';

import { showToast, toastType } from '../utils/toasts';
import { Encrypt, generateSovrinDID } from '../utils/sovrin';
import {
  LocalStorageKeys,
  SecureStorageKeys,
  UserStorageKeys,
} from '../models/phoneStorage';

import DarkButton from '../components/DarkButton';
import InputField from '../components/InputField';

// styles
import { ThemeColors } from '../styles/Colors';
import RecoverStyles from '../styles/Recover';
import RegisterStyles from '../styles/Register';

// assets
import background from '../../assets/background_1.png';

const { width } = Dimensions.get('window');

const Recover = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ixoStore = useSelector((state) => state.ixoStore);
  const userStore = useSelector((state) => state.userStore);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    dispatch(initIxo(env.REACT_APP_BLOCK_SYNC_URL));
  }, []);

  const isLedgered = (did) => {
    return new Promise((resolve, reject) => {
      ixoStore.ixo.user
        .getDidDoc(did)
        .then((response) => {
          const { error = false } = response;
          if (error) {
            return reject(t('recover:userNotFound'));
          }
          return resolve(true);
        })
        .catch((error) => {
          showToast(`Error occured: ${error}`, toastType.DANGER);
        });
    });
  };

  const handleConfirmMnemonic = async () => {
    try {
      if (confirmPassword === '' || password === '' || username === '') {
        throw t('register:missingFields');
      }
      if (password.length < 8) {
        throw t('register:passwordShort');
      }
      if (password !== confirmPassword) {
        throw t('register:missmatchPassword');
      }
      if (mnemonic === '') {
        throw t('recover:secretPhrase');
      }

      const sovrin = generateSovrinDID(mnemonic);
      const ledgered = await isLedgered('did:sov:' + sovrin.did);
      if (ledgered) {
        const encryptedMnemonic = Encrypt(
          JSON.stringify({ mnemonic: mnemonic, name: username }),
          password,
        ); // encrypt securely on phone enlave

        SInfo.setItem(
          SecureStorageKeys.encryptedMnemonic,
          encryptedMnemonic.toString(),
          {},
        );

        SInfo.setItem(SecureStorageKeys.password, password, {});
        try {
          await AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true');
        } catch (e) {
          showToast(`Internal store error: ${e}`, toastType.DANGER);
        }

        const user = {
          did: 'did:sov:' + sovrin.did,
          name: username,
          verifyKey: sovrin.verifyKey,
        };
        try {
          await AsyncStorage.setItem(UserStorageKeys.name, user.name);
          await AsyncStorage.setItem(UserStorageKeys.did, user.did);
          await AsyncStorage.setItem(UserStorageKeys.verifyKey, user.verifyKey);
        } catch (e) {
          showToast(`Internal store error: ${e}`, toastType.DANGER);
        }

        dispatch(initUser(user));
        navigateToLogin();
      }
    } catch (exception) {
      showToast(t(exception), toastType.WARNING);
    }
  };

  const navigateToLogin = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    navigation.dispatch(resetAction);
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={background} style={[RecoverStyles.wrapper]}>
        <Content>
          <KeyboardAvoidingView
            behavior={'padding'}
            contentContainerStyle={[RecoverStyles.keyboardContainer]}>
            <View>
              <View style={[RecoverStyles.flexLeft]}>
                <Text style={[RecoverStyles.header]}>
                  {t('recover:secretPhrase')}
                </Text>
              </View>
              <View style={{ width: '100%' }}>
                <View style={RecoverStyles.divider} />
              </View>

              <Text style={RecoverStyles.paragraph}>
                {t('recover:secretParagraph_1')}
              </Text>
              <Text style={RecoverStyles.paragraph}>
                <Text
                  style={[
                    RecoverStyles.paragraph,
                    { color: ThemeColors.orange },
                  ]}>
                  {t('register:warning')}:
                </Text>
                {t('register:secretParagraph_2')}
              </Text>
              <View style={[RegisterStyles.selectedBox]}>
                <TextInput
                  blurOnSubmit={true}
                  maxLength={100}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={(text) => setMnemonic(text)}
                  style={{
                    textAlign: 'left',
                    color: ThemeColors.white,
                    paddingHorizontal: 10,
                    flex: 1,
                    alignItems: 'flex-start',
                  }}>
                  {mnemonic}
                </TextInput>
              </View>
              <InputField
                value={username}
                labelName={t('register:yourName')}
                onChangeText={(text) => setUsername(text)}
              />
              <InputField
                password={true}
                value={password}
                labelName={t('register:newPassword')}
                onChangeText={(text) => setPassword(text)}
              />
              <InputField
                password={true}
                value={confirmPassword}
                labelName={t('register:confirmPassword')}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <DarkButton
                onPress={() => handleConfirmMnemonic()}
                propStyles={{ marginTop: 15 }}
                text={t('recover:next')}
              />
            </View>
          </KeyboardAvoidingView>
        </Content>
      </ImageBackground>
    </Container>
  );
};

export default Recover;
