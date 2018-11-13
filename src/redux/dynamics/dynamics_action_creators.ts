import { createAction } from '../../lib/redux_utils/actions';
import { Dynamics, TOGGLE_CONNECTION, DYNAMICS_CLEAR_STORE } from './dynamics_actions';

export function toggleConnection(online: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(TOGGLE_CONNECTION.type, {
				online
			})
		);
	};
}

export function clear() {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(DYNAMICS_CLEAR_STORE.type, {})
		);
	};
}
