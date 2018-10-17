import { createReducer } from '../../lib/redux_utils/reducers';
import { Connectivity, TOGGLE_CONNECTION } from './connectivity_actions';

export type IConnectivityState = {
	online: boolean
};

const initialState: IConnectivityState = {
	online: false
};

export let connectivityReducer = createReducer<IConnectivityState>(initialState, [
	{
		action: TOGGLE_CONNECTION,
		handler: (state: IConnectivityState, action: Connectivity) => {
			state.online = action.online;
			return {
				...state
			};
		}
	}
]);
