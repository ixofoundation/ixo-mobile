import { createReducer } from '../../lib/redux_utils/reducers';
import { Project, Projects, UserProjectInteraction, PROJECTS_UPDATE, PROJECT_SELECTED, PROJECT_CLEAR_STORE, PROJECTS_CLEAR_STORE, PROJECT_SELECTED_NO_CAPABILITY } from './projects_actions';
import { IProject } from '../../models/project';

export interface IProjectsModelState {
	projects: IProject[];
	selectedProject?: IProject;
}

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
	},
	{
		action: PROJECT_SELECTED,
		handler: (state: IProjectsModelState, action: Project) => {
			state.selectedProject = action.selectedProject;
			return {
				...state
			};
		}
	},
	{
		action: PROJECT_CLEAR_STORE,
		handler: (state: IProjectsModelState, action: Project) => {
			state.selectedProject = action.selectedProject;
			return {
				...state
			};
		}
	},
	{
		action: PROJECTS_CLEAR_STORE,
		handler: (state: IProjectsModelState, action: Projects) => {
			state.projects = action.projects
			return {
				...state
			};
		}
	},
	{
		action: PROJECT_SELECTED_NO_CAPABILITY,
		handler: (state: IProjectsModelState, action: UserProjectInteraction) => {
			return {
				...state,
				projects: state.projects.map((project: IProject, i) => project.projectDid === action.projectDid ? { ...project, userHasCapability: action.userHasCapabilities } : project)
			}
		}
	}
]);
