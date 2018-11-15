export interface Dynamics {
	online?: boolean;
	claimsSubmitted?: boolean;
	dynamicFormIndex?: number;
}

export const TOGGLE_CONNECTION = { type: 'TOGGLE_CONNECTION' };
export const TOGGLE_CLAIMS_SUBMITTED = { type: 'TOGGLE_CLAIMS_SUBMITTED' };
export const DYNAMICS_SET_CARD_INDEX = { type: 'DYNAMICS_SET_CARD_INDEX' };
export const DYNAMICS_CLEAR_STORE = { type: 'DYNAMICS_CLEAR_STORE' };
