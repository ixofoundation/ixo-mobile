import { ISovrinDid } from '../models/sovrin';

const sovrin = require('sovrin-did');
const SHA256 = require("crypto-js/sha256");

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