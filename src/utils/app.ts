import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { LOTUS_RPC_ENDPOINT, LOTUS_AUTH_TOKEN } from './constants';
import { Network } from 'src/types/app';

export const getLocalStorage = (storageName: string) => {
  return window.localStorage.getItem(storageName) || '';
};

export const setLocalStorage = (storageName: string, storageValue: string) => {
  window.localStorage.setItem(storageName, storageValue);
};

export const removeLocalStorage = (storageName: string) => {
  window.localStorage.removeItem(storageName);
};

export class WrappedLotusRPC {
  static client: any;

  constructor(network: Network, skipSingleton: boolean = false) {
    if (WrappedLotusRPC.client && !skipSingleton) {
      return WrappedLotusRPC.client;
    }
    const provider = new BrowserProvider(
      network === Network.Mainnet
        ? LOTUS_RPC_ENDPOINT.MAINNET
        : LOTUS_RPC_ENDPOINT.CALIBRATION,
      {
        token: LOTUS_AUTH_TOKEN,
      }
    );
    WrappedLotusRPC.client = new LotusRPC(provider, {
      schema: mainnet.fullNode,
    });
  }
}
