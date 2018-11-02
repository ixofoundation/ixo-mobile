export interface IUserResult {
	user: any;
}

export interface IUserInteraction {
	firstClaim?: boolean;
}

export const USER_INIT = { type: 'USER_INIT' };
export const USER_FIRST_CLAIM = { type: 'USER_FIRST_CLAIM' };
