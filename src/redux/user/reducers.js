import {
  USER_CLEAR_STORE,
  USER_FIRST_CLAIM,
  USER_FIRST_LOGIN_CREATE_PASSWORD,
  USER_INIT,
} from './actions';

const initialState = {
  user: null,
  isFirstClaim: true,
  isLoginPasswordSet: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_INIT:
      return {
        ...state,
        user: action.payload,
      };

    case USER_FIRST_CLAIM:
      return {
        ...state,
        isFirstClaim: action.payload,
      };

    case USER_FIRST_LOGIN_CREATE_PASSWORD:
      return {
        ...state,
        isLoginPasswordSet: action.payload,
      };

    case USER_CLEAR_STORE:
      return initialState;

    default:
      return state;
  }
};
