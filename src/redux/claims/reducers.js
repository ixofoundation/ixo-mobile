import { v4 as uuidv4 } from 'uuid';

import {
  CLAIM_ADD,
  CLAIM_FILEFORM_SAVE,
  CLAIM_REMOVE,
  CLAIM_SELECTED,
  CLAIM_UPDATE,
} from './actions';

const initialState = {
  savedProjectsClaims: [],
};

export const claimsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLAIM_ADD: {
      const claimId = uuidv4();
      return {
        ...state,
        savedProjectsClaims: {
          ...state.savedProjectsClaims,
          [action.payload.projectDid]: {
            ...state.savedProjectsClaims[action.payload.projectDid],
            claims: {
              ...state.savedProjectsClaims[action.payload.projectDid].claims,
              [claimId]: {
                ...state.savedProjectsClaims[action.payload.projectDid][
                  claimId
                ],
                claimData: action.payload.claimData,
                claimId,
                date: new Date(),
              },
            },
          },
        },
      };
    }

    case CLAIM_UPDATE:
      return {
        ...state,
        savedProjectsClaims: {
          ...state.savedProjectsClaims,
          [action.payload.projectDid]: {
            ...state.savedProjectsClaims[action.payload.projectDid],
            claims: {
              ...state.savedProjectsClaims[action.payload.projectDid].claims,
              [action.claimId]: {
                ...state.savedProjectsClaims[action.payload.projectDid][
                  action.payload.claimId
                ],
                claimData: action.payload.claimData,
                claimId: action.payload.claimId,
                date: new Date(),
                updated: true,
              },
            },
          },
        },
      };

    case CLAIM_REMOVE: {
      const claimId_removed = action.payload.claimId;
      const {
        [claimId_removed]: claimId,
        ...withoutClaim
      } = state.savedProjectsClaims[action.payload.projectDid].claims;

      return {
        ...state,
        savedProjectsClaims: {
          ...state.savedProjectsClaims,
          [action.payload.projectDid]: {
            ...state.savedProjectsClaims[action.payload.projectDid],
            claims: withoutClaim,
          },
        },
      };
    }

    case CLAIM_FILEFORM_SAVE:
      return {
        ...state,
        savedProjectsClaims: {
          ...state.savedProjectsClaims,
          [action.payload.projectDid]: {
            ...state.savedProjectsClaims[action.payload.projectDid],
            formFile: action.payload.formFile,
            projectDid: action.payload.projectDid,
            pdsURL: action.payload.pdsURL,
          },
        },
      };

    case CLAIM_SELECTED: {
      state.selectedSavedClaim = {
        claimId: action.payload.claimId,
        claimData: undefined,
      };
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
