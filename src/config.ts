import { Platform } from 'react-native';
import { DeviceInfoHelper, BuildEnvironments } from './utils/deviceInfoHelper';

const DeviceInfo = new DeviceInfoHelper();
const IXO_UAT = {
	REACT_APP_BLOCKCHAIN_IP: 'http://uatblockchainmobile.ixo.world',
	REACT_APP_BLOCK_SYNC_URL: 'https://uatexplorermobile.ixo.world'
};
const IXO_PROD_APPLE = {
	REACT_APP_BLOCKCHAIN_IP: 'http://appleblockchainmobile.ixo.world',
	REACT_APP_BLOCK_SYNC_URL: 'https://appleexplorermobile.ixo.world'
};
const IXO_PROD_ANDROID = {
	REACT_APP_BLOCKCHAIN_IP: 'http://androidblockchainmobile.ixo.world',
	REACT_APP_BLOCK_SYNC_URL: 'https://androidexplorermobile.ixo.world'
};
const IXO_DEV = {
	REACT_APP_BLOCKCHAIN_IP: 'http://192.168.1.253:5000',
	REACT_APP_BLOCK_SYNC_URL: 'http://192.168.1.253:8080'
};

let env = {};
if (DeviceInfo.getBuildConfig() === BuildEnvironments.ixo) {
	env = (Platform.OS === 'android') ? IXO_PROD_ANDROID : IXO_PROD_APPLE;
} else if (DeviceInfo.getBuildConfig() === BuildEnvironments.ixouat) {
	env = IXO_UAT;
} else {
	env = IXO_DEV;
}

if (__DEV__) {
	// env = IXO_DEV
}

export { env };
