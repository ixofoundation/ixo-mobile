import React from 'react';
import { Icon, View, Text } from 'native-base';

import ContainerStyles from '../styles/Containers';
import ProjectsStyles from '../styles/Projects';
import Colors from '../styles/Colors';

const HeaderSync = () => (
  <View style={[ContainerStyles.flexRow, ProjectsStyles.headerSync]}>
    <Text style={{ color: Colors.black, paddingRight: 5 }}>67</Text><Icon style={{ marginRight: 10, fontSize: 20 }} ios='ios-sync' android="md-sync" />
  </View>
);

export default HeaderSync;
