import { createAction } from '../../lib/redux_utils/actions';
import { IUser } from '../../models/user';
import { IUserResult, USER_INIT } from './user_actions';
import User from '../../../node_modules/ixo-module/dist/src/user';

export function initUser(user: IUser) {
	return (dispatch: Function) => {
		dispatch(
			createAction<IUserResult>(USER_INIT.type, {
				user: user
			})
		);
	};
}
