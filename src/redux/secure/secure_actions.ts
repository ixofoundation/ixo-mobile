export interface SovrinSecure {
	encryptedMnemonic?: string;
	sovrinDid?: string;
	password?: string;
}

export const INIT_SECURE = { type: 'INIT_SECURE' };
