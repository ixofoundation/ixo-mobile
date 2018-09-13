import { createAction } from '../../lib/redux_utils/actions';
import { IProject } from '../../models/project';
import { Projects, Project, PROJECTS_UPDATE, PROJECT_SELECTED } from './projects_actions';

export function updateProjects(projects: IProject[]) {
	return (dispatch: Function) => {
        dispatch(
            createAction<Projects>(PROJECTS_UPDATE.type, {
                projects: projects
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



