import { createAction } from '../../lib/redux_utils/actions';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_FILEFORM_SAVE } from './claims_actions';

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
