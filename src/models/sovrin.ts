export interface ISovrinDid {
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

export interface ISignature {
  type: string;
  created: Date;
  creator: string;
  publicKey: string;
  signatureValue: string;
}
