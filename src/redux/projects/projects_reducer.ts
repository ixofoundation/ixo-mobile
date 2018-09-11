import { createReducer } from '../../lib/redux_utils/reducers';
import { Projects, PROJECTS_UPDATE } from './projects_actions';


export type IProjectsModelState = {
	projects: any,
};

const initialState: IProjectsModelState = {
	projects: []
};

export let projectReducer = createReducer<IProjectsModelState>(initialState, [
	{
		action: PROJECTS_UPDATE,
		handler: (state: IProjectsModelState, action: Projects) => {
			state.projects = action.projects;
			return {
				...state
			};
		}
	}
]);
