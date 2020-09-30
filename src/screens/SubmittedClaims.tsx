import React, { useEffect, useState } from 'react';
import { ImageBackground, StatusBar, Dimensions } from 'react-native';
import { Container, Text, View } from 'native-base';
import { useTranslation } from 'react-i18next';

import CustomIcons from '../components/svg/CustomIcons';

// styles
import SubmittedClaimsStyles from '../styles/SubmittedClaims';
import { ThemeColors } from '../styles/Colors';

// assets
import background from '../../assets/background_2.png';

const { height } = Dimensions.get('window');

const SubmittedClaims = ({ isClaimSubmitted }) => {
  const { t } = useTranslation();

  const [claimSubmitted, setClaimSubmitted] = useState(true);

  useEffect(() => {
    setClaimSubmitted(isClaimSubmitted);
  }, []);

  const renderSuccess = () => {
    return (
      <View style={SubmittedClaimsStyles.wrapper}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.2 }}>
            <View
              style={[
                SubmittedClaimsStyles.iconWrapper,
                { backgroundColor: ThemeColors.success_green },
              ]}>
              <CustomIcons
                style={{ color: ThemeColors.white }}
                name="success"
                size={height * 0.05}
              />
            </View>
          </View>
          <View style={SubmittedClaimsStyles.textWrapper}>
            <View style={[SubmittedClaimsStyles.flexLeft]}>
              <Text
                style={[
                  SubmittedClaimsStyles.header,
                  { color: ThemeColors.white },
                ]}>
                {t('submittedClaims:successMessage')}
              </Text>
            </View>
            <View style={{ width: '100%' }}>
              <View style={SubmittedClaimsStyles.divider} />
            </View>
            <View style={SubmittedClaimsStyles.flexLeft}>
              <Text style={SubmittedClaimsStyles.infoBox}>
                {t('submittedClaims:successDetailedMessage')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderReject = () => {
    return (
      <View style={SubmittedClaimsStyles.wrapper}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.2 }}>
            <View
              style={[
                SubmittedClaimsStyles.iconWrapper,
                { backgroundColor: ThemeColors.failed_red },
              ]}>
              <CustomIcons
                style={{ color: ThemeColors.white }}
                name="rejected"
                size={height * 0.05}
              />
            </View>
          </View>
          <View style={SubmittedClaimsStyles.textWrapper}>
            <View style={[SubmittedClaimsStyles.flexLeft]}>
              <Text
                style={[
                  SubmittedClaimsStyles.header,
                  { color: ThemeColors.white },
                ]}>
                {t('submittedClaims:rejectMessage')}
              </Text>
            </View>
            <View style={{ width: '100%' }}>
              <View style={SubmittedClaimsStyles.divider} />
            </View>
            <View style={SubmittedClaimsStyles.flexLeft}>
              <Text style={SubmittedClaimsStyles.infoBox}>
                {t('submittedClaims:rejectDetailedMessage')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={background}
      style={SubmittedClaimsStyles.backgroundImage}>
      <Container>
        <StatusBar barStyle="light-content" />
        {claimSubmitted ? renderSuccess() : renderReject()}
      </Container>
    </ImageBackground>
  );
};

export default SubmittedClaims;
