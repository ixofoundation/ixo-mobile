import { NetInfo } from 'react-native';

export function initNetStatus(handleChange: any) {
	NetInfo.addEventListener('connectionChange', handleChange);
}

export function isConnected(): Promise<any> {
	return new Promise((resolve, reject) => {
		NetInfo.isConnected.fetch().then(isConnected => {
			isConnected ? resolve(isConnected) : reject(isConnected);
		});
	});
}
