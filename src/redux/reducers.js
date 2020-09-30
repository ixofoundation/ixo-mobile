import { combineReducers } from 'redux';

import { dynamicsReducer } from './dynamics/reducers';
import { ixoReducer } from './ixo/reducers';
import { projectReducer } from './projects/reducers';
import { userReducer } from './user/reducers';
import { claimsReducer } from './claims/reducers';

export default combineReducers({
  ixoStore: ixoReducer,
  userStore: userReducer,
  projectsStore: projectReducer,
  dynamicsStore: dynamicsReducer,
  claimsStore: claimsReducer,
});
