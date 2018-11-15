import { createAction } from '../../lib/redux_utils/actions';
import { IUser } from '../../models/user';
import { IUserResult, USER_INIT, IUserInteraction, USER_FIRST_CLAIM, USER_FIRST_LOGIN_CREATE_PASSWORD, USER_CLEAR_STORE } from './user_actions';

export function initUser(user: IUser) {
	return (dispatch: Function) => {
		dispatch(
			createAction<IUserResult>(USER_INIT.type, {
				user
			})
		);
	};
}

export function userFirstClaim() {
	return (dispatch: Function) => {
		dispatch(
			createAction<IUserInteraction>(USER_FIRST_CLAIM.type, {
				isFirstClaim: false
			})
		);
	};
}

export function userSetPassword() {
	return (dispatch: Function) => {
		dispatch(
			createAction<IUserInteraction>(USER_FIRST_LOGIN_CREATE_PASSWORD.type, {
				isLoginPasswordSet: true
			})
		);
	};
}

export function clearUser() {
	return (dispatch: Function) => {
		dispatch(
			createAction<IUserInteraction>(USER_CLEAR_STORE.type, {})
		);
	};
}
