import { IProject } from '../../models/project';

export interface Projects {
	projects: IProject[];
}

export interface Project {
	selectedProject: IProject;
}

export interface ProjectLocalOnlyData {
	userHasCapabilities?: boolean;
	projectLocalImageUri?: string;
	projectDid: string;
}

export const PROJECTS_UPDATE = { type: 'PROJECTS_UPDATE' };
export const PROJECT_SELECTED = { type: 'PROJECT_SELECTED' };
export const PROJECTS_CLEAR_STORE = { type: 'PROJECTS_CLEAR_STORE' };
export const PROJECT_CLEAR_STORE = { type: 'PROJECT_CLEAR_STORE' };
export const PROJECT_SELECTED_SET_CAPABILITY = { type: 'PROJECT_SELECTED_SET_CAPABILITY' };
export const PROJECT_SET_PROJECT_IMAGE = { type: 'PROJECT_SET_PROJECT_IMAGE' };
