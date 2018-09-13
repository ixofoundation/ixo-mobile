import _ from 'underscore';
import { createReducer } from '../../lib/redux_utils/reducers';
import { IClaim } from '../../models/project';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_FILEFORM_SAVE } from './claims_actions';

export interface IClaimsSaved {
	formFile?: any;
	projectDid: string;
	claims: IClaim[];
}

export type IClaimsModelState = {
	savedClaims: IClaimsSaved[];
};

const initialState: IClaimsModelState = {
	savedClaims: []
};

function addClaimToProject(savedClaims: IClaimsSaved[], projectDid: string, newClaim: IClaim): IClaimsSaved {
	const projectSavedClaim: IClaimsSaved | undefined = _.find(savedClaims, savedClaim => savedClaim.projectDid === projectDid);
	if (projectSavedClaim) {
		// append claim
		projectSavedClaim.claims.push(newClaim);
		return { claims: projectSavedClaim.claims, projectDid: projectDid };
	} else {
		// claim project has no claims yet
		return { claims: [newClaim], projectDid: projectDid };
	}
}

function updateClaimFormOfProject(state: IClaimsModelState, action: ClaimForm): IClaimsSaved[] {	
	const projectSavedClaim: IClaimsSaved | undefined = _.find(state.savedClaims, savedClaim => savedClaim.projectDid === action.projectDid);
	if (projectSavedClaim) {
		const test: IClaimsSaved[] = state.savedClaims.map((item) => {
			if(action.projectDid !== item.projectDid) {
				return item;
			}
			const itemCopy = Object.assign({ formFile: action.formFile }, item);
			return itemCopy;
		});
		return test;
	}
	return [...state.savedClaims, { projectDid: action.projectDid, formFile: action.formFile, claims: [] }];
}

export let claimsReducer = createReducer<IClaimsModelState>(initialState, [
	{
		action: CLAIM_ADD,
		handler: (state: IClaimsModelState, action: Claim) => {
			return {
				...state,
				savedClaims: [...state.savedClaims, addClaimToProject(state.savedClaims, action.projectDid, action.claim)]
			};
		}
	},
	{
		action: CLAIM_FILEFORM_SAVE,
		handler: (state: IClaimsModelState, action: ClaimForm) => {
			return {
				...state,
				savedClaims: updateClaimFormOfProject(state, action)
			};
		}
	}
]);
