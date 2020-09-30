import { IXO_RESULT } from './actions';

const initialState = {
  ixo: null,
  error: {},
};

export const ixoReducer = (state = initialState, action) => {
  switch (action.type) {
    case IXO_RESULT:
      return {
        ...state,
        ixo: action.payload.ixo,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
