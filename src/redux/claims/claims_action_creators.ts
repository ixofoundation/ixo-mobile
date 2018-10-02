import { createAction } from '../../lib/redux_utils/actions';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_REMOVE, CLAIM_FILEFORM_SAVE } from './claims_actions';

export function saveClaim(claimData: string, projectDid: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Claim>(CLAIM_ADD, {
				claimData,
				projectDid
			})
		);
	};
}

export function removeClaim(claimId: any, projectDid: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Claim>(CLAIM_REMOVE, {
				claimId,
				projectDid
			})
		);
	};
}

export function saveForm(formFile: any, projectDid: string, pdsURL: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<ClaimForm>(CLAIM_FILEFORM_SAVE, {
				formFile,
				projectDid,
				pdsURL
			})
		);
	};
}
