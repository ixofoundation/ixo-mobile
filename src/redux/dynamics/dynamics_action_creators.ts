import { createAction } from '../../lib/redux_utils/actions';
import { Dynamics, TOGGLE_CONNECTION, TOGGLE_CLAIMS_SUBMITTED, DYNAMICS_CLEAR_STORE, DYNAMICS_SET_CARD_INDEX } from './dynamics_actions';

export function toggleConnection(online: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(TOGGLE_CONNECTION.type, {
				online
			})
		);
	};
}

export function toggleClaimsSubmitted(claimsSubmitted: boolean) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(TOGGLE_CLAIMS_SUBMITTED.type, {
				claimsSubmitted
			})
		);
	};
}

export function dynamicSetFormCardIndex(dynamicFormIndex: number) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Dynamics>(DYNAMICS_SET_CARD_INDEX.type, {
				dynamicFormIndex
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
