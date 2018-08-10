import { createReducer } from '../../lib/redux_utils/reducers';
import { USER_INIT, IUserResult } from './user_actions';

export type IUserModelState = {
	user: any;
};

const initialState: IUserModelState = {
	user: null
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
	}
]);
