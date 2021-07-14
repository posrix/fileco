import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { LOTUS_RPC_ENDPOINT, LOTUS_AUTH_TOKEN, PATH } from './constants';
import { Network } from 'src/types/app';

const passworder = require('browser-passworder');
//@ts-ignore
window.global = window;
//@ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;
const signer = require('src/utils/signer');

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

export function getExtendedKeyBySeed(password: string): Promise<any> {
  const blob = getLocalStorage('mnemonic');
  return new Promise((resolve) => {
    passworder.decrypt(password, blob).then((result: any) => {
      const extendedKey = signer.keyDerive(result, PATH, '');
      resolve(extendedKey);
    });
  });
}

export function getAddressByNetwork(network: Network, address: string): string {
  return network === Network.Calibration
    ? address.indexOf('f') == 0
      ? address.replace('f', 't')
      : address
    : address.indexOf('t') == 0
    ? address.replace('t', 'f')
    : address;
}
