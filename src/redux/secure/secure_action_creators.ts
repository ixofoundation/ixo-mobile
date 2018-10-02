import { createAction } from '../../lib/redux_utils/actions';
import { ISecureLocal } from '../../models/phoneStorage';
import { INIT_SECURE, SovrinSecure } from './secure_actions';

export function initSecureLocal(secureLocal: ISecureLocal) {
	return (dispatch: Function) => {
		dispatch(
			createAction<SovrinSecure>(INIT_SECURE.type, {
				encryptedMnemonic: secureLocal.encryptedMnemonic,
				password: secureLocal.password,
				sovrinDid: secureLocal.sovrinDid
			})
		);
	};
}
