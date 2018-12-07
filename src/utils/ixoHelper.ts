import { getPublicStore } from '../redux/store';
import { IProject } from '../models/project';
import { updateProjects } from '../redux/projects/projects_action_creators';
import { Store } from 'redux';
import { showToast, toastType } from './toasts';
import { PublicSiteStoreState } from '../redux/public_site_reducer';

export default class IxoHelper {
	private publicStore: Store<PublicSiteStoreState>;

	private getStoreState() {
		return this.publicStore.getState();
	}

	private getProjects(): Promise<IProject[]> {
		return new Promise((resolve, reject) => {
			if (this.getStoreState().dynamicsStore.online) {
				this.getStoreState()
					.ixoStore.ixo.project.listProjects()
					.then(
						(projectList: any) => {
							resolve(projectList);
						},
						error => {
							reject([]);
						}
					);
			} else {
				showToast('No internet connection', toastType.WARNING);
				reject([]);
			}
		});
	}

	constructor() {
		this.publicStore = getPublicStore();
	}

	async updateMyProjects() {
		if (this.getStoreState().userStore.user !== null) {
			const projects = await this.getProjects();
			const myProjects = projects.filter((project: any) => {
				return project.data.agents.some((agent: any) => agent.did === this.getStoreState().userStore.user!.did && agent.role === 'SA');
			});
			this.publicStore.dispatch(updateProjects(myProjects));
		}
	}
}
