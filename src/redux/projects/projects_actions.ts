import { IProject } from '../../models/project';

export interface Projects {
    projects: IProject[];
}

export interface Project {
    selectedProject: IProject;
}

export module PROJECTS_UPDATE {
    export var type = 'PROJECTS_UPDATE';
}

export module PROJECT_SELECTED {
    export var type = 'PROJECT_SELECTED';
}