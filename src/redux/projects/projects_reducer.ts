import { createReducer } from '../../lib/redux_utils/reducers';
import { Project, Projects, ProjectLocalOnlyData, PROJECTS_UPDATE, PROJECT_SELECTED, PROJECT_CLEAR_STORE, PROJECTS_CLEAR_STORE, PROJECT_SELECTED_SET_CAPABILITY, PROJECT_SET_PROJECT_IMAGE } from './projects_actions';
import { IProject, IProjectSaved } from '../../models/project';

export interface IProjectsModelState {
	projectsLocalStates?: IProjectSaved[];
	projects: IProject[];
	selectedProject?: IProject;
}

const initialState: IProjectsModelState = {
	projects: [],
	projectsLocalStates: [],
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
		action: PROJECT_SELECTED_SET_CAPABILITY,
		handler: (state: IProjectsModelState, action: ProjectLocalOnlyData) => {
			return {
				...state,
				projectsLocal: state.projectsLocalStates.map((project: IProjectSaved, i) => project.projectDid === action.projectDid ? { ...project, userHasCapability: action.userHasCapabilities } : project)
			}
		}
	},
	{
		action: PROJECT_SET_PROJECT_IMAGE,
		handler: (state: IProjectsModelState, action: ProjectLocalOnlyData) => {
			const projectLocalFound = state.projectsLocalStates.find((project: IProjectSaved, i) => project.projectDid === action.projectDid);
			if (!projectLocalFound) {
				return {
					...state,
					projectsLocalStates: [...state.projectsLocalStates, { projectDid: action.projectDid, projectLocalImageUri: action.projectLocalImageUri }]
				}
			}
			return {
				...state,
				projectsLocalStates: state.projectsLocalStates.map((project: IProjectSaved, i) => project.projectDid === action.projectDid ? { ...project, projectLocalImageUri: action.projectLocalImageUri } : project)
			}
		}
	}
]);
