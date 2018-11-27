import { SecureStorageKeys } from '../models/phoneStorage';
import { IMnemonic, ISignature, ISovrinDid } from '../models/sovrin';
import SInfo from 'react-native-sensitive-info';

const sovrin = require('sovrin-did');
const CryptoJS = require('crypto-js');

export function generateSovrinDID(mnemonic: string): ISovrinDid {
	const seed = CryptoJS.SHA256(mnemonic).toString();
	// Convert SHA256 hash to Uint8Array
	const didSeed = new Uint8Array(32);
	for (let i = 0; i < 32; ++i) {
		didSeed[i] = parseInt(seed.substring(i * 2, i * 2 + 2), 16);
	}
	// Create the Sovrin DID
	return sovrin.fromSeed(didSeed);
}

export function verifyDocumentSignature(signature: string, publicKey: string) {
	return !(sovrin.verifySignedMessage(signature, publicKey) === false);
}

export function getSignature(payload: object): Promise<any> {
	return new Promise((resolve, reject) => {
		// @ts-ignore
		SInfo.getItem(SecureStorageKeys.encryptedMnemonic, {}).then((encryptedMnemonic: string | null) => {
			if (encryptedMnemonic) {
				// @ts-ignore
				SInfo.getItem(SecureStorageKeys.password, {}).then((password: string | null) => {
					if (password) {
						const mnemonicJson: IMnemonic = Decrypt(encryptedMnemonic, password);
						const sovrinDid: ISovrinDid = generateSovrinDID(mnemonicJson.mnemonic);
						const payloadSig = sovrin.signMessage(JSON.stringify(payload), sovrinDid.secret.signKey, sovrinDid.verifyKey);
						const signature: ISignature = {
							type: 'ed25519-sha-256',
							created: new Date(),
							creator: `did:sov:${sovrinDid.did}`,
							publicKey: sovrinDid.encryptionPublicKey,
							signatureValue: new Buffer(payloadSig)
								.slice(0, 64)
								.toString('base64')
						};

						if (!verifyDocumentSignature(payloadSig, sovrinDid.verifyKey)) {
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
	return CryptoJS.AES.encrypt(payloadHex, password);
}

export function Decrypt(cipherText: any, password: string) {
	const bytes = CryptoJS.AES.decrypt(cipherText, password);
	const contentsHex = bytes.toString(CryptoJS.enc.Utf8);
	const payloadJson = Buffer.from(contentsHex, 'hex').toString('utf8');
	return JSON.parse(payloadJson);
}
