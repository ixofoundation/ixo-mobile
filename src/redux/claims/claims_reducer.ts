import _ from 'underscore';
import { createReducer } from '../../lib/redux_utils/reducers';
import { IClaim } from '../../models/project';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_FILEFORM_SAVE } from './claims_actions';

interface IClaimsSaved {
	projectDID: string;
	claims: IClaim[];
	formFile?: any;
}

export type IClaimsModelState = {
	savedClaims: IClaimsSaved[];
};

const initialState: IClaimsModelState = {
	savedClaims: []
};

function addClaimToProject(savedClaims: IClaimsSaved[], projectDID: string, newClaim: IClaim): IClaimsSaved {
	const projectSavedClaim: IClaimsSaved | undefined = _.find(savedClaims, savedClaim => savedClaim.projectDID === projectDID);
	if (projectSavedClaim) {
		// append claim
		projectSavedClaim.claims.push(newClaim);
		return { claims: projectSavedClaim.claims, projectDID: projectDID };
	} else {
		// claim project has no claims yet
		return { claims: [newClaim], projectDID: projectDID };
	}
}

function updateClaimFormOfProject(savedClaims: IClaimsSaved[], action: ClaimForm) {
	return savedClaims.map((item) => {
		if(action.projectDID !== item.projectDID) {
            return item;
        }
        return {
            ...item,
            ...action.claimForm
        };
	});
}

export let claimsReducer = createReducer<IClaimsModelState>(initialState, [
	{
		action: CLAIM_ADD,
		handler: (state: IClaimsModelState, action: Claim) => {
			return {
				...state,
				savedClaims: [...state.savedClaims, addClaimToProject(state.savedClaims, action.projectDID, action.claim)]
			};
		}
	},
	{
		action: CLAIM_FILEFORM_SAVE,
		handler: (state: IClaimsModelState, action: ClaimForm) => {
			debugger;
			return {
				...state,
				savedClaims: [...updateClaimFormOfProject(state.savedClaims, action)]
			};
		}
	}
]);
