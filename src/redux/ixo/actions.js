export const IXO_RESULT = 'IXO_RESULT';
import { Ixo } from '@ixo/ixo-apimodule';

export const initIxo = (BLOCK_SYNC_URL) => {
  if (BLOCK_SYNC_URL) {
    const ixo = new Ixo(BLOCK_SYNC_URL);
    return {
      type: IXO_RESULT,
      payload: {
        ixo: ixo,
        error: {},
      },
    };
  } else {
    return {
      type: IXO_RESULT,
      payload: {
        ixo: null,
        error: 'Environment not setup for Blockchain node',
      },
    };
  }
};
