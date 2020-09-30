import React from 'react';
import { StatusBar } from 'react-native';
import { Container, Content, Icon, Text } from 'native-base';

//styles
import { ThemeColors } from '../styles/Colors';

const Help = () => {
  return (
    <Container style={{ backgroundColor: ThemeColors.white }}>
      <StatusBar barStyle="dark-content" />
      <Content
        contentContainerStyle={{
          backgroundColor: ThemeColors.white,
          padding: 20,
        }}>
        <Text>Content to be confirmed</Text>
      </Content>
    </Container>
  );
};

export default Help;
