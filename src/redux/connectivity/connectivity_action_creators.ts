import { createAction } from '../../lib/redux_utils/actions';
import { Connectivity, TOGGLE_CONNECTION } from './connectivity_actions';

export function toggleConnection(online: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Connectivity>(TOGGLE_CONNECTION.type, {
				online
			})
		);
	};
}
