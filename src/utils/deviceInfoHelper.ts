import { NativeModules, Platform } from 'react-native';

export enum BuildEnvironments {
	ixo = 'ixo',
	ixouat = 'ixo_uat'
}

export class DeviceInfoHelper {
	private NativeDevice: any = null;
	constructor() {
		this.NativeDevice = NativeModules.RNDeviceInfo;
	}
	private getAppleBuildBundleId(): BuildEnvironments {
		return this.NativeDevice.bundleId;
	}
	private getAndroidBuildVariant(): BuildEnvironments {
		return this.NativeDevice.buildVariant;
	}
	public getBuildConfig() {
		if (Platform.OS === 'android') {
			return this.getAndroidBuildVariant();
		} else {
			return this.getAppleBuildBundleId();
		}
	}
}
