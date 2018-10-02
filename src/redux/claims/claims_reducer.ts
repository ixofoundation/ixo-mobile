// @ts-ignore
import uuid from 'react-native-uuid';
import { createReducer } from '../../lib/redux_utils/reducers';
import { IClaimSaved } from '../../models/project';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_REMOVE, CLAIM_FILEFORM_SAVE } from './claims_actions';

export interface IProjectsClaimsSaved {
	formFile?: any;
	projectDid: string;
	pdsURL: string;
	claims?: IClaimSaved[];
}

export type IClaimsModelState = {
	savedProjectsClaims: IProjectsClaimsSaved[];
};

const initialState: IClaimsModelState = {
	savedProjectsClaims: []
};

export let claimsReducer = createReducer<IClaimsModelState>(initialState, [
	{
		action: CLAIM_ADD,
		handler: (state: IClaimsModelState, action: Claim) => {
			const claimId = uuid.v4();
			return {
				...state,
				savedProjectsClaims: {
					...state.savedProjectsClaims,
					[action.projectDid]: {
						...state.savedProjectsClaims[action.projectDid],
						claims: {
							...state.savedProjectsClaims[action.projectDid].claims,
							[claimId]: {
								...state.savedProjectsClaims[action.projectDid][claimId],
								claimData: action.claimData,
								claimId,
								date: new Date(),
							}
						}
					}
				}
			};
		}
	},
	{
		action: CLAIM_REMOVE,
		handler: (state: IClaimsModelState, action: Claim) => {
			// @ts-ignore
			const claimId_removed = action.claimId;
			// @ts-ignore
			const { [claimId_removed]: claimId, ...withoutClaim } = state.savedProjectsClaims[action.projectDid].claims;
			return {
				...state,
				savedProjectsClaims: {
					...state.savedProjectsClaims,
					[action.projectDid]: {
						...state.savedProjectsClaims[action.projectDid],
						claims: withoutClaim
					}
				}
			};
		}
	},
	{
		action: CLAIM_FILEFORM_SAVE,
		handler: (state: IClaimsModelState, action: ClaimForm) => {
			return {
				...state,
				savedProjectsClaims: {
					...state.savedProjectsClaims,
					[action.projectDid]: {
						...state.savedProjectsClaims[action.projectDid],
						formFile: action.formFile,
						projectDid: action.projectDid,
						pdsURL: action.pdsURL
					}
				}
			};
		}
	}
]);
