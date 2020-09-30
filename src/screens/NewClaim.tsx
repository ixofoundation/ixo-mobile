import React from 'react';
import {
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Container, View, Toast, Text, Icon } from 'native-base';

import CustomIcons from '../components/svg/CustomIcons';
import GenericModal from '../components/GenericModal';
import LoadingModal from '../components/LoadingModal';

//styles
import NewClaimStyles from '../styles/NewClaim';
import { ThemeColors } from '../styles/Colors';

const { height } = Dimensions.get('window');

const NewClaim = () => {
  return (
    <Container
      style={{
        backgroundColor: ThemeColors.blue_dark,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <StatusBar barStyle="light-content" />
      {this.renderForm()}
      {this.state.keyboardVisible ? null : (
        <View style={NewClaimStyles.navigatorContainer}>
          {this.buildButton(true)}
          {this.buildButton(false)}
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}>
        <GenericModal
          headingImage={
            <CustomIcons
              name={'location'}
              size={height * 0.04}
              style={NewClaimStyles.locationIcon}
            />
          }
          onPressButton={() => this.setState({ modalVisible: false })}
          onClose={() => this.setState({ modalVisible: false })}
          paragraph={this.props.screenProps.t('claims:claimRejection')}
          paragraphSecondary={this.props.screenProps.t('claims:updateSettings')}
          loading={false}
          buttonText={this.props.screenProps.t('claims:Ok')}
          heading={this.props.screenProps.t('claims:locationNeeded')}
        />
      </Modal>
      <LoadingModal isModalVisible={this.state.modalLoading} />
    </Container>
  );
};

export default NewClaim;
