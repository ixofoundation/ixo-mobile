import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import SInfo from 'react-native-sensitive-info';

import {
  LocalStorageKeys,
  SecureStorageKeys,
  UserStorageKeys,
} from '../models/phoneStorage';

import CustomIcons from '../components/svg/CustomIcons';
import IconServiceProviders from '../components/svg/iconServiceProviders';
import { Decrypt, generateSovrinDID, getSignature } from '../utils/sovrin';
import validator from 'validator';
import GenericModal from '../components/GenericModal';
import { showToast, toastType } from '../utils/toasts';

import ModalStyle from '../styles/Modal';
import ScanQRStyles from '../styles/ScanQR';
import { ThemeColors } from '../styles/Colors';
import ContainerStyles from '../styles/Containers';

import { AddingServiceProvider } from '../utils/scanQR';

import keysafelogo from '../../assets/keysafe-logo.png';
import qr from '../../assets/qr.png';

const { width, height } = Dimensions.get('window');

const InfoBlocks = ({ keySafeText, qrCodeText, helpText }) => (
  <View style={ScanQRStyles.infoBlockOuterContainer}>
    <View style={[ContainerStyles.flexRow, { alignItems: 'flex-end' }]}>
      <View style={[ContainerStyles.flexRow, ScanQRStyles.infoBlock]}>
        <Image
          resizeMode={'contain'}
          style={ScanQRStyles.infoBlockImage}
          source={keysafelogo}
        />
        <Text style={ScanQRStyles.keysafeText}>{keySafeText}</Text>
      </View>
      <View style={[ContainerStyles.flexRow, ScanQRStyles.infoBlock]}>
        <Image
          resizeMode={'contain'}
          style={ScanQRStyles.infoBlockImage}
          source={qr}
        />
        <Text style={ScanQRStyles.infoText}>{qrCodeText}</Text>
      </View>
    </View>
    <View style={ScanQRStyles.dividerContainer}>
      <View style={ScanQRStyles.divider} />
    </View>
    <View style={[ContainerStyles.flexRow, ScanQRStyles.moreInfoTextContainer]}>
      <TouchableOpacity onPress={() => console.log('TODO')}>
        <Text style={ScanQRStyles.moreInfoText}>{helpText}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const InfoBlocksServiceProvider = ({ qrCodeText, helpText }) => (
  <View style={ScanQRStyles.infoBlockOuterContainer}>
    <View style={[ContainerStyles.flexRow, { alignItems: 'flex-end' }]}>
      <View style={[ContainerStyles.flexRow, ScanQRStyles.infoBlock]}>
        <Image
          resizeMode={'contain'}
          style={ScanQRStyles.infoBlockImage}
          source={qr}
        />
        <Text style={ScanQRStyles.infoText}>{qrCodeText}</Text>
      </View>
    </View>
    <View style={ScanQRStyles.dividerContainer}>
      <View style={ScanQRStyles.divider} />
    </View>
    <View style={[ContainerStyles.flexRow, ScanQRStyles.moreInfoTextContainer]}>
      <TouchableOpacity onPress={() => console.log('TODO')}>
        <Text style={ScanQRStyles.moreInfoText}>{helpText}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ScanQR = ({ user, ixo, onUserInit }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [errors, setErrors] = useState(false);
  const [keysafePasswordError, setKeysafePasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState(undefined);
  const [payload, setPayload] = useState(null);
  const [projectDid, setProjectDid] = useState(null);
  const [projectTitle, setProjectTitle] = useState(null);
  const [revealPassword, setRevealPassword] = useState(true);
  const [serviceEndpoint, setServiceEndpoint] = useState(null);
  const [serviceProviderFieldError, setServiceProviderFieldError] = useState(
    '',
  );
  const [serviceProviderState, setServiceProviderState] = useState(
    AddingServiceProvider.confirmProject,
  );
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const [userEmail, setUserEmail] = useState('');

  let _projectScan = true;

  const _handleBarCodeRead = (_payload) => {
    if (!modalVisible) {
      if (validator.isBase64(_payload.data) && !_projectScan) {
        setModalVisible(true);
        setPayload(_payload.data);
      } else if (_payload.data.includes('projects') && _projectScan) {
        const _projectDid = _payload.data.substring(
          _payload.data.length - 39,
          _payload.data.length - 9,
        );

        setModalVisible(true);
        setPayload(null);
        setProjectDid(_projectDid);

        ixo.project.getProjectByProjectDid(_projectDid).then((project) => {
          setProjectTitle(project.data.title);
          setServiceEndpoint(project.data.serviceEndpoint);
        });
      } else {
        setErrors(true);
        setModalVisible(true);
      }
    }
  };

  const handleUnlockPayload = () => {
    if (!password || password === '') {
      setKeysafePasswordError(t('scanQR:missingField'));
      return;
    }
    setLoading(true);
    if (payload && password) {
      try {
        const mnemonicJson = Decrypt(payload, password);

        SInfo.setItem(SecureStorageKeys.encryptedMnemonic, payload, {});

        // AsyncStorage.setItem(LocalStorageKeys.firstLaunch, 'true');

        const user = {
          did: 'did:sov:' + generateSovrinDID(mnemonicJson.mnemonic).did,
          name: mnemonicJson.name,
          verifyKey: generateSovrinDID(mnemonicJson.mnemonic).verifyKey,
        };
        // AsyncStorage.setItem(UserStorageKeys.name, user.name);
        // AsyncStorage.setItem(UserStorageKeys.did, user.did);
        // AsyncStorage.setItem(UserStorageKeys.verifyKey, user.verifyKey);

        onUserInit(user);
        resetStateVars();
        navigation.navigate('Login');
      } catch (exception) {
        setLoading(false);
        setKeysafePasswordError(t('scanQR:keysafePasswordWrong'));
      }
    } else {
      setErrors(true);
      setLoading(false);
    }
  };

  const handleRegisterServiceAgent = () => {
    if (userEmail === '') {
      setLoading(false);
      setServiceProviderFieldError(t('scanQR:missingField'));
      return;
    }
    setLoading(true);
    try {
      const agentData = {
        email: userEmail,
        name: user.name,
        role: 'SA',
        agentDid: user.did,
        projectDid: projectDid,
      };
      getSignature(agentData).then((signature) => {
        ixo.agent
          .createAgent(agentData, signature, serviceEndpoint)
          .then((res) => {
            if (res.error !== undefined) {
              showToast(res.error.message, toastType.DANGER);
              resetStateVars();
            } else {
              showToast(
                `${t('scanQR:successRegistered')} ${agentData.role}`,
                toastType.SUCCESS,
              );
              setServiceProviderState(AddingServiceProvider.success);
              setLoading(false);
            }
          })
          .catch((exception) => {
            showToast('Network Error', toastType.DANGER);
            setErrors(true);
            setLoading(false);
          });
      });
    } catch (exception) {
      setErrors(true);
      setLoading(false);
    }
  };

  const navigateToProjects = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Projects' }],
    });
    navigation.dispatch(resetAction);
  };

  const resetStateVars = () => {
    setModalVisible(false);
    setPassword(undefined);
    setPayload(null);
    setErrors(false);
    setProjectDid(null);
    setProjectTitle(null);
    setServiceEndpoint(null);
    setLoading(false);
    setServiceProviderState(AddingServiceProvider.confirmProject);
  };

  const renderInfoBlocks = () => {
    if (_projectScan) {
      return (
        <InfoBlocksServiceProvider
          helpText={t('scanQR:serviceProviderHelp')}
          qrCodeText={t('scanQR:serviceProviderScan')}
        />
      );
    } else {
      return (
        <InfoBlocks
          helpText={t('scanQR:loginHelp')}
          qrCodeText={t('connectIXO:qrCodeInfo')}
          keySafeText={t('connectIXO:keySafeInfo')}
        />
      );
    }
  };

  const renderErrorScanned = () => {
    const registerAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Register' }],
    });
    if (_projectScan) {
      return (
        <GenericModal
          onPressButton={() => resetStateVars()}
          onClose={() => resetStateVars()}
          paragraph={t('scanQR:projectFailedScan')}
          loading={loading}
          buttonText={t('scanQR:rescan')}
          heading={t('scanQR:scanFailed')}
          onPressInfo={() => {
            resetStateVars();
            navigation.dispatch(registerAction);
          }}
        />
      );
    }
    return (
      <GenericModal
        onPressButton={() => resetStateVars()}
        onClose={() => resetStateVars()}
        paragraph={t('scanQR:errorKeySafe')}
        loading={loading}
        buttonText={t('scanQR:rescan')}
        heading={t('scanQR:scanFailed')}
        infoText={t('scanQR:registered')}
        onPressInfo={() => {
          resetStateVars();
          navigation.navigate('Register');
        }}
      />
    );
  };

  const renderProjectScanned = () => {
    if (errors) {
      return renderErrorScanned();
    }

    switch (serviceProviderState) {
      case AddingServiceProvider.confirmProject:
        return (
          <GenericModal
            headingTextStyle={{ color: ThemeColors.white }}
            heading={`${projectTitle} ${t('scanQR:project')}`}
            headingImage={
              <IconServiceProviders height={height * 0.1} width={width * 0.2} />
            }
            onPressButton={() =>
              setServiceProviderState(AddingServiceProvider.provideDetails)
            }
            onClose={() => resetStateVars()}
            paragraph={t('scanQR:youAreRegistering')}
            loading={loading}
            buttonText={t('scanQR:continue')}
          />
        );
      case AddingServiceProvider.provideDetails:
        return (
          <GenericModal
            headingImage={
              <IconServiceProviders
                height={height * 0.08}
                width={width * 0.2}
              />
            }
            onPressButton={() => handleRegisterServiceAgent()}
            onClose={() => resetStateVars()}
            paragraph={t('scanQR:serviceProviderDescription')}
            paragraphSecondary={t('scanQR:serviceProviderQuestion')}
            loading={loading}
            buttonText={t('scanQR:submit')}
            inputFieldOptions={{
              error: serviceProviderFieldError,
              onChangeText: (_userEmail) => setUserEmail(_userEmail),
              label: t('scanQR:yourAnswer'),
            }}
          />
        );
      case AddingServiceProvider.success:
        return (
          <GenericModal
            headingTextStyle={{ color: ThemeColors.white }}
            onPressButton={() => {
              navigateToProjects();
            }}
            onClose={() => {
              resetStateVars();
              navigateToProjects();
            }}
            paragraph={t('scanQR:serviceProviderMessage')}
            loading={loading}
            headingImage={
              <IconServiceProviders height={height * 0.1} width={width * 0.2} />
            }
            buttonText={t('scanQR:close')}
            heading={`${t('scanQR:welcomeMessage')} ${projectTitle}!`}
          />
        );
    }
  };

  const renderKeySafeScannedModal = () => {
    if (errors) {
      return renderErrorScanned();
    }
    return (
      <GenericModal
        onPressButton={() => handleUnlockPayload()}
        onClose={() => resetStateVars()}
        paragraph={t('connectIXOComplete:unlockInformation')}
        loading={loading}
        buttonText={t('connectIXOComplete:unlockButtonText')}
        heading={t('connectIXOComplete:scanSuccessful')}
        inputFieldOptions={{
          error: keysafePasswordError,
          underlinePositionRatio: 0.038,
          onChangeText: (_password) => setPassword(_password),
          password: revealPassword,
          label: t('scanQR:password'),
          prefixImage: (
            <Image
              resizeMode={'contain'}
              style={ModalStyle.inputFieldPrefixImage}
              source={keysafelogo}
            />
          ),
          suffixImage: (
            <CustomIcons
              name="eyeoff"
              size={width * 0.06}
              style={{ color: ThemeColors.blue_lightest }}
            />
          ),
          onSuffixImagePress: () => setRevealPassword(!revealPassword),
          containerStyle: { flex: 1, marginVertical: height * 0.03 },
        }}
      />
    );
  };

  return (
    <View style={[ScanQRStyles.wrapper]}>
      <StatusBar barStyle="light-content" />
      <Modal
        onRequestClose={() => null}
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        {_projectScan ? renderProjectScanned() : renderKeySafeScannedModal()}
      </Modal>
      <RNCamera
        style={{ flex: 1 }}
        type={type}
        onBarCodeRead={_handleBarCodeRead}
        flashMode={RNCamera.Constants.FlashMode.on}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={
          'We need your permission to use your camera phone'
        }>
        {renderInfoBlocks()}
      </RNCamera>
    </View>
  );
};

export default ScanQR;
