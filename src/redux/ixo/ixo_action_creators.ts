import { createAction } from '../../lib/redux_utils/actions';
import { Ixo } from 'ixo-module';
import { IxoResult, IXO_RESULT } from './ixo_actions';
const dns = require('dns');

export function initIxo(BLOCKCHAIN_IP: string, BLOCK_SYNC_URL: string) {
	return (dispatch: Function) => {
		debugger;
		dns.resolve('www.w3schools.com', 'A', function(err, addresses, family) {
			console.log(addresses);
		});
		if (BLOCKCHAIN_IP && BLOCK_SYNC_URL) {
			debugger;
			dns.resolve(BLOCK_SYNC_URL, (err, result) => {
				debugger;
				console.log(result);
			});
			const ixo = new Ixo(BLOCKCHAIN_IP, BLOCK_SYNC_URL);
			dispatch(
				createAction<IxoResult>(IXO_RESULT.type, {
					ixo: ixo,
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
