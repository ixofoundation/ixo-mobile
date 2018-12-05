import { ImageEditor, ImageStore, Image } from 'react-native';
import { getPublicStore } from '../redux/store';
import { setProjectLocalImage } from '../redux/projects/projects_action_creators';
import { IProject } from '../models/project';

function saveProjectImageBase64(store, projectDid, base64Image) {
	store.dispatch(setProjectLocalImage(projectDid, base64Image));
}

export function getLocalProjectImage(projectDid) {
	const project = getPublicStore()
		.getState()
		.projectsStore.projects.find((p: IProject) => p.projectDid === projectDid);
	if (project && project.projectLocalImageUri) {
		return `data:image/jpeg;base64,${project.projectLocalImageUri}`;
	}
	return '';
}

export function setLocalProjectImage(projectDid, remoteUri) {
	const store = getPublicStore();
	const project = store.getState().projectsStore.projects.find((p: IProject) => p.projectDid === projectDid);
	if (!project.projectLocalImageUri) {
		Image.getSize(
			remoteUri,
			(width, height) => {
				ImageEditor.cropImage(
					remoteUri,
					{ size: { height, width }, offset: { x: 0, y: 0 } },
					imageStoreUrl => {
						ImageStore.getBase64ForTag(imageStoreUrl, base64 => saveProjectImageBase64(store, projectDid, base64), error => console.log(error));
					},
					error => console.log('Error downloading image for project', error)
				);
			},
			error => {
				console.log(error);
			}
		);
	}
}
