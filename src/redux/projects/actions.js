export const PROJECTS_UPDATE = 'PROJECTS_UPDATE';
export const PROJECT_SELECTED = 'PROJECT_SELECTED';
export const PROJECTS_CLEAR_STORE = 'PROJECTS_CLEAR_STORE';
export const PROJECT_CLEAR_STORE = 'PROJECT_CLEAR_STORE';
export const PROJECT_SELECTED_SET_CAPABILITY =
  'PROJECT_SELECTED_SET_CAPABILITY';
export const PROJECT_SET_PROJECT_IMAGE = 'PROJECT_SET_PROJECT_IMAGE';

export const updateProjects = (projects) => {
  return {
    type: PROJECTS_UPDATE,
    payload: projects,
  };
};

export const loadProject = (project) => {
  return {
    type: PROJECT_SELECTED,
    payload: project,
  };
};

export const clearProjects = () => {
  return {
    type: PROJECTS_CLEAR_STORE,
  };
};

export const clearProject = () => {
  return {
    type: PROJECT_CLEAR_STORE,
  };
};

export const setProjectUserCapability = (projectDid, hasCapability) => {
  return {
    type: PROJECT_SELECTED_SET_CAPABILITY,
    payload: { projectDid, userHasCapabilities: hasCapability },
  };
};

export const setProjectLocalImage = (projectDid, projectLocalImageUri) => {
  return {
    type: PROJECT_SET_PROJECT_IMAGE,
    payload: {
      projectDid,
      projectLocalImageUri,
    },
  };
};
