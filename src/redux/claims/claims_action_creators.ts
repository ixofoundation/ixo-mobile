import { createAction } from '../../lib/redux_utils/actions';
import { IClaim } from '../../models/project';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_FILEFORM_SAVE } from './claims_actions';

export function saveClaim(claim: IClaim, projectDid: string) {
	return (dispatch: Function) => {
        dispatch(
            createAction<Claim>(CLAIM_ADD.type, {
                claim,
                projectDid
            })
        );
	};
}

export function saveForm(formFile: any, projectDid: string) {
	return (dispatch: Function) => {
        dispatch(
            createAction<ClaimForm>(CLAIM_FILEFORM_SAVE.type, {
                formFile,
                projectDid
            })
        );
	};
}
