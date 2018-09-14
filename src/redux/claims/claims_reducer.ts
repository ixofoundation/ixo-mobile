import _ from 'underscore';
// @ts-ignore
import uuid from 'react-native-uuid';
import { createReducer } from '../../lib/redux_utils/reducers';
import { IClaimSaved } from '../../models/project';
import { Claim, ClaimForm, CLAIM_ADD, CLAIM_FILEFORM_SAVE } from './claims_actions';

export interface IProjectsClaimsSaved {
	formFile?: any;
	projectDid: string;
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
			return {
				...state,
				savedProjectsClaims: {
					...state.savedProjectsClaims,
					[action.projectDid]: {
						...state.savedProjectsClaims[action.projectDid],
						claims: {
							...state.savedProjectsClaims[action.projectDid].claims,
							[uuid.v4()]: {
								...state.savedProjectsClaims[action.projectDid][uuid.v4()],
								claimData: action.claimData,
								claimId: uuid.v4(),
								date: new Date(),
							}
						}
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
						projectDid: action.projectDid
					}
				}
			};
		}
	}
]);
