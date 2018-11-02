import { Platform } from 'react-native';
import { createAction } from '../../lib/redux_utils/actions';
import { Ixo } from 'ixo-module';
import { IxoResult, IXO_RESULT } from './ixo_actions';

export function initIxo(BLOCKCHAIN_IP: string, BLOCK_SYNC_URL: string) {
	return (dispatch: Function) => {
		if (BLOCKCHAIN_IP && BLOCK_SYNC_URL) {
			const ixo = new Ixo(BLOCKCHAIN_IP, BLOCK_SYNC_URL);
			dispatch(
				createAction<IxoResult>(IXO_RESULT.type, {
					ixo,
					error: {}
				})
			);
		} else {
			dispatch(
				createAction<IxoResult>(IXO_RESULT.type, {
					ixo: null,
					error: 'Environment not setup for Blockchain node'
				})
			);
		}
	};
}

export function resetIxo() {
	return (dispatch: Function) => {
		dispatch(
			createAction<IxoResult>(IXO_RESULT.type, {
				ixo: null,
				error: {}
			})
		);
	};
}
