import { Platform } from 'react-native';
let env = {};
if (Platform.OS === 'android') {
  env = {
    REACT_APP_BLOCKCHAIN_IP: 'http://androidblockchainmobile.ixo.world',
    REACT_APP_BLOCK_SYNC_URL: 'http://block_sync_pandora.ixo.world',
  };
} else {
  env = {
    REACT_APP_BLOCKCHAIN_IP: 'http://appleblockchainmobile.ixo.world',
    REACT_APP_BLOCK_SYNC_URL: 'http://block_sync_pandora.ixo.world',
  };
}

const dev_env = {
  // local dev environment
  REACT_APP_BLOCKCHAIN_IP: 'http://192.168.1.253:5000',
  REACT_APP_BLOCK_SYNC_URL: 'http://192.168.1.253:8080',
};

if (__DEV__) {
  // env = dev_env;
}

export { env };
