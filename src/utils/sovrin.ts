import { ISovrinDid, IMnemonic } from '../models/sovrin';
import { SecureStore } from 'expo';
import { SecureStorageKeys } from '../models/phoneStorage';

const sovrin = require('sovrin-did');
const AES = require('crypto-js/aes');
const SHA256 = require('crypto-js/sha256');
const Encode = require('crypto-js/enc-utf8');
const CryptoJS = require('crypto-js');

export function generateSovrinDID(mnemonic: string): ISovrinDid {
	const seed = SHA256(mnemonic).toString();

	// Convert SHA256 hash to Uint8Array
	var didSeed = new Uint8Array(32);
	for (var i = 0; i < 32; ++i) {
		didSeed[i] = parseInt(seed.substring(i * 2, i * 2 + 2), 16);
	}

	// Create the Sovrin DID
	return sovrin.fromSeed(didSeed);
}

export function verifyDocumentSignature(signature: string, publicKey: string) {
	return !(sovrin.verifySignedMessage(signature, publicKey) === false);
}

export function GetSignature(payload: object): Promise<any> {
	return new Promise((resolve, reject) => {
		SecureStore.getItemAsync(SecureStorageKeys.encryptedMnemonic).then((encryptedMnemonic: string | null) => {
			if (encryptedMnemonic) {
				SecureStore.getItemAsync(SecureStorageKeys.password).then((password: string | null) => {
					if (password) {
						const mnemonicJson: IMnemonic = Decrypt(encryptedMnemonic, password);
						const sovrinDid: ISovrinDid = generateSovrinDID(mnemonicJson.mnemonic);
						const signature = sovrin.signMessage(JSON.stringify(payload), sovrinDid.secret.signKey, sovrinDid.verifyKey);
						signature.signatureValue = new Buffer(signature)
							.slice(0, 64)
							.toString('hex')
							.toUpperCase();

						signature.type = 'ed25519-sha-256';
						signature.creator = `did:sov:${sovrinDid.did}`;
						signature.created = new Date();
						signature.publicKey = sovrinDid.encryptionPublicKey;

						if (!verifyDocumentSignature(signature, sovrinDid.verifyKey)) {
							return reject();
						}
						return resolve(signature);
					}
				});
			}
		});
	});
}

export function Encrypt(data: string, password: string) {
	const payloadString = data;
	const payloadHex = new Buffer(payloadString).toString('hex');
	return AES.encrypt(payloadHex, password);
}

export function Decrypt(cipherText: any, password: string) {
	let bytes = AES.decrypt(cipherText, password);
	let contentsHex = bytes.toString(CryptoJS.enc.Utf8);
	const payloadJson = Buffer.from(contentsHex, 'hex').toString('utf8');
	return JSON.parse(payloadJson);
}
