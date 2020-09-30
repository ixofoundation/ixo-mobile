import { ImageEditor, ImageStore, Image } from 'react-native';
import { getPublicStore } from 'redux';
import { setProjectLocalImage } from '../redux/projects/actions';

function saveProjectImageBase64(store, projectDid, base64Image) {
  store.dispatch(setProjectLocalImage(projectDid, base64Image));
}

export function getLocalProjectImage(projectDid) {
  const project = getPublicStore()
    .getState()
    .projectsStore.projectsLocalStates.find((p) => p.projectDid === projectDid);
  if (project && project.projectLocalImageUri) {
    return `data:image/jpeg;base64,${project.projectLocalImageUri}`;
  }
  return '';
}

export function setLocalProjectImage(projectDid, remoteUri) {
  const store = getPublicStore();
  Image.getSize(
    remoteUri,
    (width, height) => {
      ImageEditor.cropImage(
        remoteUri,
        { size: { height, width }, offset: { x: 0, y: 0 } },
        (imageStoreUrl) => {
          ImageStore.getBase64ForTag(
            imageStoreUrl,
            (base64) => saveProjectImageBase64(store, projectDid, base64),
            (error) => console.log(error),
          );
        },
        (error) => console.log('Error downloading image for project', error),
      );
    },
    (error) => {
      console.log(error);
    },
  );
}
