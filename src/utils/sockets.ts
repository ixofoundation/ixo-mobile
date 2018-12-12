import SocketIOClient from 'socket.io-client';
import IxoHelper from './ixoHelper';
import { getPublicStore } from '../redux/store';
import { env } from '../config';

export default class Sockets {
	private sockets: any;
	private ixoHelper: IxoHelper = new IxoHelper();
	constructor() {
		this.sockets = SocketIOClient(env.REACT_APP_BLOCK_SYNC_URL);
		this.initSocketForClaims();
	}

	initSocketForClaims() {
		// this.sockets.on('claim added', (data: { projectDid: string }) => {
		// 	const projects = getPublicStore().getState().projectsStore.projects;
		// 	const myProject = projects.find(project => project.projectDid === data.projectDid);
		// 	if (myProject.projectDid === data.projectDid) {
		// 		this.ixoHelper.updateMyProjects();
		// 	}
		// });
	}
}
