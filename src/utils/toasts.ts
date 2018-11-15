import { Toast } from 'native-base';

export enum toastType {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger'
}

export function showToast(toastText: string, type: toastType) {
	return Toast.show({
		text: toastText,
		type,
		position: 'top'
	});
}
