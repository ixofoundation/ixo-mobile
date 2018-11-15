import { createReducer } from '../../lib/redux_utils/reducers';
import { Dynamics, TOGGLE_CONNECTION, DYNAMICS_CLEAR_STORE, TOGGLE_CLAIMS_SUBMITTED, DYNAMICS_SET_CARD_INDEX } from './dynamics_actions';

export interface IDynamicsState {
	online: boolean;
	claimsSubmitted: boolean;
	dynamicFormIndex: number;
}

const initialState: IDynamicsState = {
	online: false,
	claimsSubmitted: false,
	dynamicFormIndex: 0
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
		action: TOGGLE_CLAIMS_SUBMITTED,
		handler: (state: IDynamicsState, action: Dynamics) => {
			state.claimsSubmitted = action.claimsSubmitted;
			return {
				...state
			};
		}
	},
	{
		action: DYNAMICS_SET_CARD_INDEX,
		handler: (state: IDynamicsState, action: Dynamics) => {
			state.dynamicFormIndex = action.dynamicFormIndex;
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
