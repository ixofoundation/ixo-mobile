import {
  DYNAMICS_CLEAR_STORE,
  DYNAMICS_SET_CARD_INDEX,
  TOGGLE_CLAIMS_SUBMITTED,
  TOGGLE_CONNECTION,
} from './actions';

const initialState = {
  online: false,
  claimsSubmitted: false,
  dynamicFormIndex: 0,
};

export const dynamicsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CONNECTION:
      return {
        ...state,
        online: action.payload,
      };

    case TOGGLE_CLAIMS_SUBMITTED:
      return {
        ...state,
        claimsSubmitted: action.payload,
      };

    case DYNAMICS_SET_CARD_INDEX:
      return {
        ...state,
        dynamicFormIndex: action.payload,
      };

    case DYNAMICS_CLEAR_STORE:
      return initialState;

    default:
      return state;
  }
};
