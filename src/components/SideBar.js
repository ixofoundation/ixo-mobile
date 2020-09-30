import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Dimensions } from 'react-native';
import { View, Text, Container } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import LinearGradient from 'react-native-linear-gradient';

import CustomIcon from '../components/svg/CustomIcons';
import { UserStorageKeys } from '../models/phoneStorage';

//styles
import ContainerStyles from '../styles/Containers';
import SideBarStyles from '../styles/componentStyles/Sidebar';
import { ClaimsButton, SignOutBox } from '../styles/Colors';

//assets
import ixoLogo from '../../assets/logo.png';
import helpIcon from '../../assets/help.png';
import settingIcon from '../../assets/settings.png';

const { height } = Dimensions.get('window');

const SideBar = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [did, setDid] = useState('');

  const retrieveUserFromStorage = async () => {
    try {
      const newName = await AsyncStorage.getItem(UserStorageKeys.name);
      const newDid = await AsyncStorage.getItem(UserStorageKeys.did);

      setName(newName);
      setDid(newDid);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveUserFromStorage();
  }, []);

  return (
    <Container style={SideBarStyles.wrapper}>
      <LinearGradient
        style={SideBarStyles.userInfoBox}
        colors={[ClaimsButton.colorSecondary, ClaimsButton.colorPrimary]}>
        <View
          style={[
            ContainerStyles.flexRow,
            { justifyContent: 'space-between', alignItems: 'center' },
          ]}>
          <CustomIcon
            name="close"
            onPress={() => navigation.closeDrawer()}
            style={SideBarStyles.closeDrawer}
          />
          <Image source={ixoLogo} style={SideBarStyles.ixoLogo} />
        </View>
        <View style={[ContainerStyles.flexRow, SideBarStyles.userBox]}>
          <View
            style={[ContainerStyles.flexColumn, { alignItems: 'flex-start' }]}>
            <Text style={SideBarStyles.userName}>{name}</Text>
            <Text style={SideBarStyles.userDid}>{did}</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={[ContainerStyles.flexColumn, SideBarStyles.linksBox]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
          <Image source={settingIcon} style={SideBarStyles.iconLinks} />
          <Text style={SideBarStyles.textLinks}>{t('sidebar:settings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Help')}
          style={[ContainerStyles.flexRow, SideBarStyles.linkBox]}>
          <Image source={helpIcon} style={SideBarStyles.iconLinks} />
          <Text style={SideBarStyles.textLinks}>{t('sidebar:help')}</Text>
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={[SignOutBox.colorSecondary, SignOutBox.colorPrimary]}
        style={[ContainerStyles.flexColumn, SideBarStyles.signOutBox]}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={SideBarStyles.signOut}>{t('sidebar:signOut')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Container>
  );
};

export default SideBar;
