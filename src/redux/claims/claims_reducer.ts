// @ts-ignore
import uuid from 'react-native-uuid';
import { createReducer } from '../../lib/redux_utils/reducers';
import { IClaimSaved } from '../../models/project';
import { Claim, ClaimForm, SelectedClaim, CLAIM_ADD, CLAIM_UPDATE, CLAIM_REMOVE, CLAIM_FILEFORM_SAVE, CLAIM_SELECTED } from './claims_actions';

export interface IProjectsClaimsSaved {
	formFile?: any;
	projectDid: string;
	pdsURL: string;
	claims?: IClaimSaved[];
}

export interface IClaimsModelState {
	savedProjectsClaims: IProjectsClaimsSaved[];
	selectedSavedClaim?: IClaimSaved;
}

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
		action: CLAIM_UPDATE,
		handler: (state: IClaimsModelState, action: Claim) => {
			return {
				...state,
				savedProjectsClaims: {
					...state.savedProjectsClaims,
					[action.projectDid]: {
						...state.savedProjectsClaims[action.projectDid],
						claims: {
							...state.savedProjectsClaims[action.projectDid].claims,
							[action.claimId]: {
								...state.savedProjectsClaims[action.projectDid][action.claimId],
								claimData: action.claimData,
								claimId: action.claimId,
								date: new Date(),
								updated: true,
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
	},
	{
		action: CLAIM_SELECTED,
		handler: (state: IClaimsModelState, action: SelectedClaim) => {
			state.selectedSavedClaim = { claimId: action.claimId, claimData: undefined };
			return {
				...state
			};
		}
	}
]);
