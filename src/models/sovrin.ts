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

