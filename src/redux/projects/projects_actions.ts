import { IProject } from '../../models/project';

export interface Projects {
    projects: IProject[];
}

export module PROJECTS_UPDATE {
    export var type = 'PROJECTS_UPDATE';
}
