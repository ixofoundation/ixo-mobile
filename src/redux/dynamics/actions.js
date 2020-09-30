export const TOGGLE_CONNECTION = 'TOGGLE_CONNECTION';
export const TOGGLE_CLAIMS_SUBMITTED = 'TOGGLE_CLAIMS_SUBMITTED';
export const DYNAMICS_SET_CARD_INDEX = 'DYNAMICS_SET_CARD_INDEX';
export const DYNAMICS_CLEAR_STORE = 'DYNAMICS_CLEAR_STORE';

export const toggleConnection = (online) => {
  return {
    type: TOGGLE_CONNECTION,
    payload: online,
  };
};

export const toggleClaimsSubmitted = (claimsSubmitted) => {
  return {
    type: TOGGLE_CLAIMS_SUBMITTED,
    payload: claimsSubmitted,
  };
};

export const dynamicSetFormCardIndex = (dynamicFormIndex) => {
  return {
    type: DYNAMICS_SET_CARD_INDEX,
    payload: dynamicFormIndex,
  };
};

export const clear = () => {
  return {
    type: DYNAMICS_CLEAR_STORE,
  };
};
