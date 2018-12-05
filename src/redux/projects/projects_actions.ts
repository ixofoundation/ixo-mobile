import { IProject } from '../../models/project';

export interface Projects {
	projects: IProject[];
}

export interface Project {
	selectedProject: IProject;
}

export interface UserProjectInteraction {
	userHasCapabilities: boolean;
	projectDid: string;
}

export interface ProjectLocalOnlyData {
	projectLocalImageUri: string;
	projectDid: string;
}

export const PROJECTS_UPDATE = { type: 'PROJECTS_UPDATE' };
export const PROJECT_SELECTED = { type: 'PROJECT_SELECTED' };
export const PROJECTS_CLEAR_STORE = { type: 'PROJECTS_CLEAR_STORE' };
export const PROJECT_CLEAR_STORE = { type: 'PROJECT_CLEAR_STORE' };
export const PROJECT_SELECTED_NO_CAPABILITY = { type: 'PROJECT_SELECTED_NO_CAPABILITY' };
export const PROJECT_SET_PROJECT_IMAGE = { type: 'PROJECT_SET_PROJECT_IMAGE' };
