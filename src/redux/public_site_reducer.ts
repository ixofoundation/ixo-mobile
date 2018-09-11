// State of the admin panel store
import { combineReducers, Reducer } from 'redux';
import { IIxoModelState, ixoReducer } from './ixo/ixo_reducer';
import { IUserModelState, userReducer } from './user/user_reducer';
import { IProjectsModelState, projectReducer } from './projects/projects_reducer';

export interface PublicSiteStoreState {
	ixoStore: IIxoModelState;
	userStore: IUserModelState;
	projectsStore: IProjectsModelState;
}

export const publicSiteReducer: Reducer<PublicSiteStoreState> = combineReducers({
	ixoStore: ixoReducer,
	userStore: userReducer,
	projectsStore: projectReducer
	// Add other reducers here
}) as Reducer<PublicSiteStoreState>;
