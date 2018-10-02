import { createAction } from '../../lib/redux_utils/actions';
import { Connectivity, TOGGLE_CONNECTION } from './connectivity_actions';

export function toggleConnection(offline: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Connectivity>(TOGGLE_CONNECTION.type, {
				offline
			})
		);
	};
}
