import { createAction } from '../../lib/redux_utils/actions';
import { IClaim } from '../../models/project';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_FILEFORM_SAVE } from './claims_actions';

export function saveClaim(claim: IClaim, projectDID: string) {
	return (dispatch: Function) => {
        dispatch(
            createAction<Claim>(CLAIM_ADD.type, {
                claim,
                projectDID
            })
        );
	};
}

export function saveForm(claimForm: any, projectDID: string) {
	return (dispatch: Function) => {
        dispatch(
            createAction<ClaimForm>(CLAIM_FILEFORM_SAVE.type, {
                claimForm,
                projectDID
            })
        );
	};
}
