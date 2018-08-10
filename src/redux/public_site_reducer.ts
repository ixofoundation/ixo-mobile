// State of the admin panel store
import { combineReducers, Reducer } from 'redux';
import  { IIxoModelState, ixoReducer } from './ixo/ixo_reducer';

export interface PublicSiteStoreState {
	ixoStore: IIxoModelState;
}

export const publicSiteReducer: Reducer<PublicSiteStoreState> = combineReducers({
	ixoStore: ixoReducer,
	// Add other reducers here
}) as Reducer<PublicSiteStoreState>;
