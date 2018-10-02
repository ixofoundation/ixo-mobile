export interface Claim {
	claimData?: string;
	projectDid: string;
	claimId?: string;
}

export interface ClaimForm {
	formFile: any;
	projectDid: string;
	pdsURL: string;
}

// export type CLAIM_ADD = 'CLAIM_ADD';
// export const  CLAIM_ADD: CLAIM_ADD = 'CLAIM_ADD';

// export type CLAIM_REMOVE = 'CLAIM_REMOVE';
// export const  CLAIM_REMOVE: CLAIM_REMOVE = 'CLAIM_REMOVE';

// export type CLAIM_UPDATE = 'CLAIM_UPDATE';
// export const  CLAIM_UPDATE: CLAIM_UPDATE = 'CLAIM_UPDATE';

// export type CLAIM_FILEFORM_SAVE = 'CLAIM_FILEFORM_SAVE';
// export const  CLAIM_FILEFORM_SAVE: CLAIM_FILEFORM_SAVE = 'CLAIM_FILEFORM_SAVE';

export const CLAIM_ADD = { type: 'CLAIM_ADD' };
export const CLAIM_REMOVE = { type: 'CLAIM_REMOVE' };
export const CLAIM_UPDATE = { type: 'CLAIM_UPDATE' };
export const CLAIM_FILEFORM_SAVE = { type: 'CLAIM_FILEFORM_SAVE' };