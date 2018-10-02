import { createReducer } from '../../lib/redux_utils/reducers';
import { Connectivity, TOGGLE_CONNECTION } from './connectivity_actions';

export type IConnectivityState = {
	offline: boolean
};

const initialState: IConnectivityState = {
	offline: false
};

export let connectivityReducer = createReducer<IConnectivityState>(initialState, [
	{
		action: TOGGLE_CONNECTION,
		handler: (state: IConnectivityState, action: Connectivity) => {
			state.offline = action.offline;
			return {
				...state
			};
		}
	}
]);
