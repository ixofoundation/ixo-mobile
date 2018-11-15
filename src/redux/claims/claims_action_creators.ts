import { createAction } from '../../lib/redux_utils/actions';
import { Claim, SelectedClaim, ClaimForm, CLAIM_ADD, CLAIM_REMOVE, CLAIM_FILEFORM_SAVE, CLAIM_UPDATE, CLAIM_SELECTED, CLAIM_CLEAR_STORE, CLAIM_SELECTED_CLEAR_STORE, CLAIM_FILEFORM_CLEAR_STORE, CLAIM_SELECTED_SET_DATA } from './claims_actions';

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

export function updateClaim(claimData: string, projectDid: string, claimId: string) {
	return (dispatch: Function) => {
		dispatch(
			createAction<Claim>(CLAIM_UPDATE.type, {
				claimData,
				projectDid,
				claimId
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

export function clearClaim() {
	return (dispatch: Function) => {
		dispatch(
			createAction<Claim>(CLAIM_CLEAR_STORE.type, {
				projectDid: null
			})
		);
	};
}

export function clearFileForm() {
	return (dispatch: Function) => {
		dispatch(
			createAction<SelectedClaim>(CLAIM_FILEFORM_CLEAR_STORE.type, {
				claimId: null
			})
		);
	};
}

export function clearSelected() {
	return (dispatch: Function) => {
		dispatch(
			createAction<ClaimForm>(CLAIM_SELECTED_CLEAR_STORE.type, {
				formFile: null,
				pdsURL: null,
				projectDid: null
			})
		);
	};
}
