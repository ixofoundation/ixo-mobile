export interface IUserResult {
	user: any;
}

export interface IUserInteraction {
	isFirstClaim?: boolean;
	isLoginPasswordSet?: boolean;
}

export const USER_INIT = { type: 'USER_INIT' };
export const USER_FIRST_CLAIM = { type: 'USER_FIRST_CLAIM' };
export const USER_FIRST_LOGIN_CREATE_PASSWORD = { type: 'USER_FIRST_LOGIN_CREATE_PASSWORD' };
export const USER_CLEAR_STORE = { type: 'USER_CLEAR_STORE' };
