import { createReducer } from '../../lib/redux_utils/reducers';
import { INIT_SECURE, SovrinSecure } from './secure_actions';

export type ISensitiveStoreState = {
	encryptedMnemonic?: string;
	sovrinDid?: string;
	password?: string;
};

const initialState: ISensitiveStoreState = {
	encryptedMnemonic: undefined,
	sovrinDid: undefined,
	password: undefined
};

export let secureReducer = createReducer<ISensitiveStoreState>(initialState, [
	{
		action: INIT_SECURE,
		handler: (state: ISensitiveStoreState, action: SovrinSecure) => {
			state.encryptedMnemonic = action.encryptedMnemonic;
			state.password = action.password;
			state.sovrinDid = action.password;
			return {
				...state
			};
		}
	}
]);
