import { createAction } from '../../lib/redux_utils/actions';
import { IProject } from '../../models/project';
import { Projects, PROJECTS_UPDATE } from './projects_actions';

export function updateProjects(projects: IProject[]) {
	return (dispatch: Function) => {
        dispatch(
            createAction<Projects>(PROJECTS_UPDATE.type, {
                projects: projects
            })
        );
	};
}
