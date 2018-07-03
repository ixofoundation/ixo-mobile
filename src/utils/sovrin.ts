import { ISovrinDid } from '../models/sovrin';
import { SecureStore } from 'expo';
import { AsyncStorage } from 'react-native';

const sovrin = require('sovrin-did');
const bs58 = require('bs58');
const SHA256 = require('crypto-js/sha256');

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
        AsyncStorage.getItem('sovrinDid').then((did: string) => {
            if (did) {
                SecureStore.getItemAsync(did).then((mnemonic: any) => {
                    if (mnemonic) {
                        const sovrinDid: ISovrinDid = generateSovrinDID(mnemonic);
                        const signature = bs58.encode(sovrin.signMessage(payload, sovrinDid.secret.signKey, sovrinDid.verifyKey));
                        console.log('Signature', signature);
                        return resolve(signature);
                    }
                });
            }
        });
        // AsyncStorage.getItem('sovrinDid', (error: any, did: string | undefined) => {
        //     if (did) {
        //         SecureStore.getItemAsync(did).then((mnemonic: any) => {
        //             if (mnemonic) {
        //                 const sovrinDid: ISovrinDid = generateSovrinDID(mnemonic);
        //                 const signature = bs58.encode(sovrin.signMessage(payload, sovrinDid.secret.signKey, sovrinDid.verifyKey));
        //                 console.log('Signature', signature);
        //                 return resolve(signature);
        //             }
        //         });
        //     }
        //     return reject(error); 
        // });
    });
}

