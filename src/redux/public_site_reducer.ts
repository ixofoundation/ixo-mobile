// State of the admin panel store
import { combineReducers, Reducer } from 'redux';
import { IIxoModelState, ixoReducer } from './ixo/ixo_reducer';
import { IUserModelState, userReducer } from './user/user_reducer';
import { IProjectsModelState, projectReducer } from './projects/projects_reducer';
import { IClaimsModelState, claimsReducer } from './claims/claims_reducer';
import { IDynamicsState, dynamicsReducer } from './dynamics/dynamics_reducer';

export interface PublicSiteStoreState {
	ixoStore: IIxoModelState;
	userStore: IUserModelState;
	projectsStore: IProjectsModelState;
	claimsStore: IClaimsModelState;
	dynamicsStore: IDynamicsState;
}

export const publicSiteReducer: Reducer<PublicSiteStoreState> = combineReducers({
	ixoStore: ixoReducer,
	userStore: userReducer,
	projectsStore: projectReducer,
	claimsStore: claimsReducer,
	dynamicsStore: dynamicsReducer,
}) as Reducer<PublicSiteStoreState>;
