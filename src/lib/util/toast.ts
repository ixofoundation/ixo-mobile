import { Toast } from 'native-base';

// Toast util
export enum ToastType {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger'
}

export enum ToastPosition {
	TOP = 'top',
	CENTER = 'center',
	BOTTOM = 'bottom'
}

export function showToastMessage(text: string, toastType: ToastType, position: ToastPosition) {
	return Toast.show({
		text: text,
		buttonText: 'OK',
		type: toastType,
		position: position
	});
}
