import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { LOTUS_RPC_ENDPOINT, LOTUS_AUTH_TOKEN, PATH } from './constants';
import { Network } from 'src/types/app';
import signer from 'src/utils/signer';

const passworder = require('browser-passworder');

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

export function convertFilecoin(value: number) {
  // remain 4 decimals
  return Math.floor(value * Math.pow(10, -18) * 1e4) / 1e4;
}

export async function transfer({
  client,
  from,
  to,
  value,
  privateKey,
}: {
  client: any;
  from: string;
  to: string;
  value: number;
  privateKey: string;
}) {
  const unsignedMessage = {
    From: from,
    GasFeeCap: '0',
    GasLimit: 0,
    GasPremium: '0',
    params: '',
    Method: 0,
    Nonce: 0,
    To: to,
    Value: String(value),
  };

  // get nonce and compare value with balance
  const actor = await client.StateGetActor(from, []);
  if (actor.Balance < value) {
    throw new Error('transfer amount is greater than balance');
  }
  unsignedMessage.Nonce = actor.Nonce;

  // get gas info
  const estimateMessageGas = await client.gasEstimateMessageGas(
    unsignedMessage,
    { MaxFee: '0' },
    []
  );
  unsignedMessage.GasFeeCap = estimateMessageGas.GasFeeCap;
  unsignedMessage.GasLimit = estimateMessageGas.GasLimit;
  unsignedMessage.GasPremium = estimateMessageGas.GasPremium;

  // sign message and push message
  const signedMessage = signer.transactionSignLotus(
    unsignedMessage,
    privateKey
  );
  await client.mpoolPush(signedMessage);
}
