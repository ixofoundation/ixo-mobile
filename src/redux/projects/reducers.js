import {
  PROJECTS_CLEAR_STORE,
  PROJECTS_UPDATE,
  PROJECT_CLEAR_STORE,
  PROJECT_SELECTED,
  PROJECT_SELECTED_SET_CAPABILITY,
  PROJECT_SET_PROJECT_IMAGE,
} from './actions';

const initialState = {
  projects: [],
  projectsLocalStates: [],
  selectedProject: undefined,
};

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECTS_UPDATE:
      return {
        ...state,
        projects: action.payload,
      };

    case PROJECT_SELECTED:
      return {
        ...state,
        selectedProject: action.payload,
      };

    case PROJECTS_CLEAR_STORE:
      return {
        ...state,
        projects: [],
      };

    case PROJECT_CLEAR_STORE:
      return {
        ...state,
        selectedProject: undefined,
      };

    case PROJECT_SELECTED_SET_CAPABILITY:
      return {
        ...state,
        projectsLocal: state.projectsLocalStates.map((project) =>
          project.projectDid === action.payload.projectDid
            ? {
                ...project,
                userHasCapability: action.payload.userHasCapabilities,
              }
            : project,
        ),
      };

    case PROJECT_SET_PROJECT_IMAGE:
      const projectLocalFound = state.projectsLocalStates.find(
        (project) => project.projectDid === action.payload.projectDid,
      );
      if (!projectLocalFound) {
        return {
          ...state,
          projectsLocalStates: [
            ...state.projectsLocalStates,
            {
              projectDid: action.payload.projectDid,
              projectLocalImageUri: action.payload.projectLocalImageUri,
            },
          ],
        };
      }
      return {
        ...state,
        projectsLocalStates: state.projectsLocalStates.map((project) =>
          project.projectDid === action.payload.projectDid
            ? {
                ...project,
                projectLocalImageUri: action.payload.projectLocalImageUri,
              }
            : project,
        ),
      };

    default:
      return state;
  }
};
