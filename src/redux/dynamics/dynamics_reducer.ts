import { createReducer } from '../../lib/redux_utils/reducers';
import { Dynamics, TOGGLE_CONNECTION, TOGGLE_MODAL, DYNAMICS_CLEAR_STORE } from './dynamics_actions';

export interface IDynamicsState {
	online: boolean;
	isModalVisible: boolean;
}

const initialState: IDynamicsState = {
	online: false,
	isModalVisible: false
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
		action: TOGGLE_MODAL,
		handler: (state: IDynamicsState, action: Dynamics) => {
			state.isModalVisible = action.isModalVisible
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
