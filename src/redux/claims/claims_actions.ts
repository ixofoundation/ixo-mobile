import { IClaim } from '../../models/project';

export interface Claim {
    claim: IClaim;
    projectDID: string;
}

export interface ClaimForm {
    claimForm: any;
    projectDID: string;
}

export module CLAIM_ADD {
    export var type = 'CLAIM_ADD';
}

export module CLAIM_FILEFORM_SAVE {
    export var type = 'CLAIM_FILEFORM_SAVE';
}
