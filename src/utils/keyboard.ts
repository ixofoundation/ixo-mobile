import { Keyboard } from 'react-native';

export default class KeyboardUtil {
	private keyboardDidShowListener?: any;
	private keyboardDidHideListener?: any;
	private handleKeyboardDidShow: any;
	private handleKeyboardDidHide: any;

	constructor(handleKeyboardDidShow: any, handleKeyboardDidHide: any) {
		this.handleKeyboardDidHide = handleKeyboardDidHide;
		this.handleKeyboardDidShow = handleKeyboardDidShow;
		if (this.handleKeyboardDidHide && this.handleKeyboardDidShow) {
			this.setKeyboardListeners();
		}
	}

	setKeyboardListeners(kill: boolean = false) {
		if (!kill) {
			this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
			this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
		} else {
			this.keyboardDidShowListener.remove();
			this.keyboardDidHideListener.remove();
		}
	}
}
