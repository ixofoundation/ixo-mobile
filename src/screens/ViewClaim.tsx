import React from 'react';
import { Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { Container, Content, View } from 'native-base';

import DoubleButton from '../components/DoubleButton';

const { height } = Dimensions.get('window');
const dynamicForm = React.createRef();

const ViewClaim = () => {
  return (
    <Container
      style={{
        backgroundColor: ThemeColors.grey_sync,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          height: height * 0.18,
          backgroundColor: ThemeColors.blue_dark,
          paddingHorizontal: '3%',
          paddingTop: '2%',
        }}
      />
      <View
        style={[
          {
            position: 'absolute',
            height: height - 100,
            top: 30,
            alignSelf: 'center',
            width: '95%',
          },
        ]}>
        <Content>{this.renderForm()}</Content>
      </View>
      {this.editable ? (
        <DoubleButton
          text={'SAVE'}
          secondText={'SUBMIT'}
          onPress={() => dynamicForm.current.handleSave()}
          secondOnPress={() => dynamicForm.current.handleSubmit()}
        />
      ) : null}
    </Container>
  );
};

export default ViewClaim;
