import { Toast } from 'native-base';

export enum toastType {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger'
}

export function showToast(toastText: string, toastType: toastType) {
    return Toast.show({
        text: toastText,
        type: toastType,
        position: 'top'
    });
}