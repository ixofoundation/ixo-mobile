import * as React from 'react';
import { StyleProvider, Root, Icon } from 'native-base';
import { Font } from 'expo';
import getTheme from './native-base-theme/components';

import Stack from './Routes';

const robotoFont = require('./assets/fonts/Roboto/Roboto-Light.ttf');
const robotoFontBold = require('./assets/fonts/Roboto/Roboto-Regular.ttf');
const robotoFontMedium = require('./assets/fonts/Roboto/Roboto-Medium.ttf');

export default class App extends React.Component<{}> {

  async componentDidMount() { // Update font style with spec
    await Font.loadAsync({
      Roboto_medium: robotoFontMedium,
      Roboto: robotoFont,
      RobotoBold: robotoFontBold,
    });
    this.setState({ isReady: true });
  }

  render() {
    return (
      <Root>
        <StyleProvider style={getTheme()}>
          <Stack />
        </StyleProvider>
      </Root>
    );
  }
}