export const CLAIM_ADD = 'CLAIM_ADD';
export const CLAIM_REMOVE = 'CLAIM_REMOVE';
export const CLAIM_UPDATE = 'CLAIM_UPDATE';
export const CLAIM_SELECTED = 'CLAIM_SELECTED';
export const CLAIM_FILEFORM_SAVE = 'CLAIM_FILEFORM_SAVE';
export const CLAIM_CLEAR_STORE = 'CLAIM_CLEAR_STORE';
export const CLAIM_SELECTED_CLEAR_STORE = 'CLAIM_SELECTED_CLEAR_STORE';
export const CLAIM_FILEFORM_CLEAR_STORE = 'CLAIM_FILEFORM_CLEAR_STORE';

export const saveClaim = (claimData, projectDid) => {
  return {
    type: CLAIM_ADD,
    payload: {
      claimData,
      projectDid,
    },
  };
};

export const updateClaim = (claimData, projectDid, claimId) => {
  return {
    type: CLAIM_UPDATE,
    payload: {
      claimData,
      projectDid,
      claimId,
    },
  };
};

export const removeClaim = (claimId, projectDid) => {
  return {
    type: CLAIM_REMOVE,
    payload: {
      claimId,
      projectDid,
    },
  };
};

export const saveForm = (formFile, projectDid, pdsURL) => {
  return {
    type: CLAIM_FILEFORM_SAVE,
    payload: {
      formFile,
      projectDid,
      pdsURL,
    },
  };
};

export const loadSavedClaim = (claimId) => {
  return {
    type: CLAIM_SELECTED,
    payload: claimId,
  };
};

export const loadSubmittedClaim = (claimId) => {
  return {
    type: CLAIM_SELECTED,
    payload: claimId,
  };
};

export const clearClaim = () => {
  return {
    type: CLAIM_CLEAR_STORE,
    payload: null,
  };
};

export const clearFileForm = () => {
  return {
    type: CLAIM_FILEFORM_CLEAR_STORE,
    payload: null,
  };
};

export const clearSelected = () => {
  return {
    type: CLAIM_SELECTED_CLEAR_STORE,
    payload: {
      formFile: null,
      pdsURL: null,
      projectDid: null,
    },
  };
};
