import { IProject } from '../../models/project';

export interface Projects {
	projects: IProject[];
}

export interface Project {
	selectedProject: IProject;
}

export const PROJECTS_UPDATE = { type: 'PROJECTS_UPDATE' };
export const PROJECT_SELECTED = { type: 'PROJECT_SELECTED' };