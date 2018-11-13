import { createReducer } from '../../lib/redux_utils/reducers';
import { Dynamics, TOGGLE_CONNECTION, DYNAMICS_CLEAR_STORE } from './dynamics_actions';

export interface IDynamicsState {
	online: boolean;
}

const initialState: IDynamicsState = {
	online: false
};

export let dynamicsReducer = createReducer<IDynamicsState>(initialState, [
	{
		action: TOGGLE_CONNECTION,
		handler: (state: IDynamicsState, action: Dynamics) => {
			state.online = action.online;
			return {
				...state
			};
		}
	},
	{
		action: DYNAMICS_CLEAR_STORE,
		handler: (state: IDynamicsState, action: Dynamics) => {
			state = initialState;
			return {
				...state
			};
		}
	}
]);
