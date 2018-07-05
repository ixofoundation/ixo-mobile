import { ISovrinDid } from '../models/sovrin';
import { SecureStore } from 'expo';
import { AsyncStorage } from 'react-native';
import { LocalStorageKeys, SecureStorageKeys } from '../models/phoneStorage';

const sovrin = require('sovrin-did');
const bs58 = require('bs58');
const AES = require("crypto-js/aes");
const SHA256 = require('crypto-js/sha256');
const Encode = require('crypto-js/enc-utf8');
// const Encrypt = require('crypto/enc');

const signature : { 
    type: string,
    created?: Date | undefined,
    creator: string,
    publicKey: string,
    signatureValue: string,
 } = {
    type: 'ed25519-sha-256',
    created: null,
    creator: '',
    publicKey: '',
    signatureValue: '',
};

// const encryptPassword = (data: object, saltPassword: string) => {
//     return AES.encrypt(data, saltPassword);
// };

// const decrypt = (cipherText: string, password: string ) => {
//     var bytes  = AES.decrypt(cipherText.toString(), password);
//     //return bytes.toString(Encrypt.Utf8);
// };

export function generateSovrinDID(mnemonic: string): ISovrinDid {
    const seed = SHA256(mnemonic).toString();

    // Convert SHA256 hash to Uint8Array
    var didSeed = new Uint8Array(32);
    for (var i = 0; i < 32; ++i) {
        didSeed[i] = parseInt(seed.substring(i * 2, i * 2 + 2), 16)
    }

    // Create the Sovrin DID
    return sovrin.fromSeed(didSeed);
}

export function GetSignature(payload: string): Promise<any> {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(LocalStorageKeys.sovrinDid).then((did: string) => {
            if (did) {
                SecureStore.getItemAsync(did).then((mnemonic: any) => {
                    if (mnemonic) {
                        const sovrinDid: ISovrinDid = generateSovrinDID(mnemonic);
                        signature.signatureValue = bs58.encode(sovrin.signMessage(payload, sovrinDid.secret.signKey, sovrinDid.verifyKey));
                        signature.creator = sovrinDid.did;
                        signature.created = new Date();
                        signature.publicKey = sovrinDid.encryptionPublicKey
                        return resolve(signature);
                    }
                });
            }
        });
    });
}

export function CreateNewVaultAndRestore (accountName: string, password: string, mnemonic: string) {
    const cipherText = AES.encrypt(JSON.stringify({ accountName, mnemonic }), password);
    SecureStore.setItemAsync(SecureStorageKeys.mnemonic, cipherText);
}

export function Decrypt(cipherText: any, password: string) {
    var bytes  = AES.decrypt(cipherText.toString(), password);
    return JSON.parse(bytes.toString(Encode));
}

