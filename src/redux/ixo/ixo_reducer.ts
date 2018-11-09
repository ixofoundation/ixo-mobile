import { createReducer } from '../../lib/redux_utils/reducers';
import { IxoResult, IXO_RESULT } from './ixo_actions';

export interface IIxoModelState {
	ixo: any;
	error: Object;
}

const initialState: IIxoModelState = {
	ixo: null,
	error: {},
};

export let ixoReducer = createReducer<IIxoModelState>(initialState, [
	{
		action: IXO_RESULT,
		handler: (state: IIxoModelState, action: IxoResult) => {
			state.ixo = action.ixo;
			state.error = action.error;
			return {
				...state
			};
		}
	}
]);
