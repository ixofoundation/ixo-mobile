import { createAction } from '../../lib/redux_utils/actions';
import { Dynamics, TOGGLE_CONNECTION, TOGGLE_MODAL } from './dynamics_actions';

export function toggleConnection(online: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(TOGGLE_CONNECTION.type, {
				online
			})
		);
	};
}

export function userToggledModal(isModalVisible: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(TOGGLE_MODAL.type, {
				isModalVisible
			})
		);
	};
}
