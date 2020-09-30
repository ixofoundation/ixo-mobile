export const USER_INIT = 'USER_INIT';
export const USER_FIRST_CLAIM = 'USER_FIRST_CLAIM';
export const USER_FIRST_LOGIN_CREATE_PASSWORD =
  'USER_FIRST_LOGIN_CREATE_PASSWORD';
export const USER_CLEAR_STORE = 'USER_CLEAR_STORE';

export const initUser = (user) => {
  return {
    type: USER_INIT,
    payload: user,
  };
};

export const userFirstClaim = () => {
  return {
    type: USER_FIRST_CLAIM,
    payload: false,
  };
};

export const userSetPassword = () => {
  return {
    type: USER_FIRST_LOGIN_CREATE_PASSWORD,
    payload: true,
  };
};

export const clearUser = () => {
  return {
    type: USER_CLEAR_STORE,
  };
};
