import { createReducer } from '../../lib/redux_utils/reducers';
import { USER_INIT, IUserResult, USER_FIRST_CLAIM, IUserInteraction } from './user_actions';

export interface IUserModelState {
	user: any;
	firstClaim: boolean;
}

const initialState: IUserModelState = {
	user: null,
	firstClaim: true
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
			state.firstClaim = action.firstClaim
			return {
				...state
			};
		}
	}
]);
