import { createAction } from '../../lib/redux_utils/actions';
import { Claim, SelectedClaim, ClaimForm, CLAIM_ADD, CLAIM_REMOVE, CLAIM_FILEFORM_SAVE, CLAIM_UPDATE, CLAIM_SELECTED } from './claims_actions';

export function saveClaim(claimData: string, projectDid: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Claim>(CLAIM_ADD.type, {
				claimData,
				projectDid
			})
		);
	};
}

export function removeClaim(claimId: any, projectDid: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Claim>(CLAIM_REMOVE.type, {
				claimId,
				projectDid
			})
		);
	};
}

export function saveForm(formFile: any, projectDid: string, pdsURL: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<ClaimForm>(CLAIM_FILEFORM_SAVE.type, {
				formFile,
				projectDid,
				pdsURL
			})
		);
	};
}

export function loadSavedClaim(claimId: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<SelectedClaim>(CLAIM_SELECTED.type, {
				claimId
			})
		);
	};
}

export function loadSubmittedClaim(claimId: string) { // does the same as loadSavedClaim for now
	return (dispatch: Function) => {
		dispatch(
			createAction<SelectedClaim>(CLAIM_SELECTED.type, {
				claimId
			})
		);
	};
}
