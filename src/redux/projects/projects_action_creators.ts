import { createAction } from '../../lib/redux_utils/actions';
import { IProject } from '../../models/project';
import { Projects, Project, UserProjectInteraction, ProjectLocalOnlyData, PROJECTS_UPDATE, PROJECT_SELECTED, PROJECTS_CLEAR_STORE, PROJECT_CLEAR_STORE, PROJECT_SELECTED_NO_CAPABILITY, PROJECT_SET_PROJECT_IMAGE } from './projects_actions';

export function updateProjects(projects: IProject[]) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Projects>(PROJECTS_UPDATE.type, {
				projects
			})
		);
	};
}

export function loadProject(project: IProject) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Project>(PROJECT_SELECTED.type, {
				selectedProject: project
			})
		);
	};
}

export function clearProjects() {
	return (dispatch: Function) => {
		dispatch(
			createAction<Projects>(PROJECTS_CLEAR_STORE.type, {
				projects: []
			})
		);
	};
}

export function clearProject() {
	return (dispatch: Function) => {
		dispatch(
			createAction<Project>(PROJECT_CLEAR_STORE.type, {
				selectedProject: undefined
			})
		);
	};
}

export function setProjectUserCapability(projectDid: string, hasCapability: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<UserProjectInteraction>(PROJECT_SELECTED_NO_CAPABILITY.type, {
				projectDid,
				userHasCapabilities: hasCapability
			})
		);
	};
}

export function setProjectLocalImage(projectDid: string, projectLocalImageUri: string) {
	return createAction<ProjectLocalOnlyData>(PROJECT_SET_PROJECT_IMAGE.type, {
		projectDid,
		projectLocalImageUri
	});
}
