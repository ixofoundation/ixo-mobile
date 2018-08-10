export interface ISovrinDid {
	name: string;
	did: string;
	verifyKey: string;
	encryptionPublicKey: string;
	secret: ISecret;
}

interface ISecret {
	seed: string;
	signKey: string;
	encryptionPrivateKey: string;
}

export interface IMnemonic {
	name: string;
	mnemonic: string;
}
