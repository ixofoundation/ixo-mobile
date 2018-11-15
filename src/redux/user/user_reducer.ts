import { createReducer } from '../../lib/redux_utils/reducers';
import { USER_INIT, IUserResult, USER_FIRST_CLAIM, IUserInteraction, USER_FIRST_LOGIN_CREATE_PASSWORD, USER_CLEAR_STORE } from './user_actions';

export interface IUserModelState {
	user: any;
	isFirstClaim: boolean;
	isLoginPasswordSet: boolean;
}

const initialState: IUserModelState = {
	user: null,
	isFirstClaim: true,
	isLoginPasswordSet: false
};

export let userReducer = createReducer<IUserModelState>(initialState, [
	{
		action: USER_INIT,
		handler: (state: IUserModelState, action: IUserResult) => {
			state.user = action.user;
			return {
				...state
			};
		}
	},
	{
		action: USER_FIRST_CLAIM,
		handler: (state: IUserModelState, action: IUserInteraction) => {
			state.isFirstClaim = action.isFirstClaim
			return {
				...state
			};
		}
	},
	{
		action: USER_FIRST_LOGIN_CREATE_PASSWORD,
		handler: (state: IUserModelState, action: IUserInteraction) => {
			state.isLoginPasswordSet = action.isLoginPasswordSet
			return {
				...state
			};
		}
	},
	{
		action: USER_CLEAR_STORE,
		handler: (state: IUserModelState, action: IUserInteraction) => {
			state = initialState;
			return {
				...state
			};
		}
	}
]);
