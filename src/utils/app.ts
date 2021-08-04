import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { LOTUS_RPC_ENDPOINT, LOTUS_AUTH_TOKEN, PATH } from './constants';
import { Network, Cid, Message, MsgLookup } from 'src/types/app';
import moment from 'moment';
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

export function getFilByUnit(value: number, decimal: number = 4) {
  const filScope = Math.pow(10, 18);
  const nanoScope = Math.pow(10, 9);
  const attoScope = 0;
  if (value >= filScope) {
    return (
      Math.floor(value * Math.pow(10, -18) * Math.pow(10, decimal)) /
        Math.pow(10, decimal) +
      ' FIL'
    );
  } else if (value <= filScope && value >= nanoScope) {
    return (
      Math.floor(value * Math.pow(10, -9) * Math.pow(10, decimal)) /
        Math.pow(10, decimal) +
      ' nanoFIL'
    );
  } else if (value <= nanoScope && value > attoScope) {
    return (
      Math.floor(value * Math.pow(10, decimal)) / Math.pow(10, decimal) +
      ' attoFIL'
    );
  }
}

export function addressEllipsis(address: string) {
  const head = address.substring(0, 7);
  const tail = address.substring(address.length - 4, address.length);
  return `${head}...${tail}`;
}

export function constructUnsignedMessage({
  from,
  to,
  value,
}: {
  from: string;
  to: string;
  value: number;
}) {
  return {
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
}

export async function getEstimateGas(unsignedMessage: any): Promise<any> {
  const estimateMessageGas = await WrappedLotusRPC.client.gasEstimateMessageGas(
    unsignedMessage,
    { MaxFee: '0' },
    []
  );
  return {
    gasFeeCap: estimateMessageGas.GasFeeCap,
    gasLimit: estimateMessageGas.GasLimit,
    gasPremium: estimateMessageGas.GasPremium,
  };
}

export class SearchMessage {
  private elapse: number = 0;

  public async byCid({
    cid,
    enablePolling = false,
    timeout = 5000,
    onSuccess,
    onError,
  }: {
    cid: Cid;
    enablePolling?: boolean;
    timeout?: number;
    onSuccess?: (message: MsgLookup) => void;
    onError?: () => void;
  }): Promise<MsgLookup> {
    const searchedMessage = await WrappedLotusRPC.client.stateSearchMsg(cid);
    if (!searchedMessage) {
      if (enablePolling) {
        // polling will be over after 5 mins
        if (this.elapse >= 5 * 60 * 1000) {
          if (onError) {
            onError();
          }
          this.elapse = 0;
          throw new Error('Message can not be sent');
        }
        this.elapse += timeout;
        setTimeout(
          () => this.byCid({ cid, enablePolling, onSuccess, onError }),
          timeout
        );
      } else {
        throw new Error('Message not exist');
      }
    } else {
      if (onSuccess) {
        onSuccess(searchedMessage);
      }
      return searchedMessage;
    }
  }
}

export async function getMessageTimestampByHeight({
  Height,
  TipSet,
}: Pick<MsgLookup, 'Height' | 'TipSet'>): Promise<number> {
  const tipSet = await WrappedLotusRPC.client.chainGetTipSetByHeight(
    Height,
    TipSet
  );
  return tipSet.Blocks[0].Timestamp;
}

export async function getMessageByCid(cid: Cid): Promise<Message> {
  const { Height, TipSet } = await new SearchMessage().byCid({ cid });
  const messageFromGet = await WrappedLotusRPC.client.chainGetMessage(cid);
  const timestamp = await getMessageTimestampByHeight({ Height, TipSet });
  return {
    cid: messageFromGet['CID'],
    from: messageFromGet['From'],
    to: messageFromGet['To'],
    value: messageFromGet['Value'],
    datetime: moment.unix(timestamp).format('YYYY/MM/DD h:mm:ss'),
    height: Height,
    pending: false,
  };
}

export async function sendSignedMessage({
  from,
  to,
  value,
  privateKey,
}: {
  from: string;
  to: string;
  value: number;
  privateKey: string;
}) {
  const unsignedMessage = constructUnsignedMessage({ from, to, value });

  // get nonce and compare value with balance
  const actor = await WrappedLotusRPC.client.StateGetActor(from, []);
  if (actor.Balance < value) {
    throw new Error('transfer amount is greater than balance');
  }
  unsignedMessage.Nonce = actor.Nonce;

  // get gas info
  const { gasFeeCap, gasLimit, gasPremium } = await getEstimateGas(
    unsignedMessage
  );
  unsignedMessage.GasFeeCap = gasFeeCap;
  unsignedMessage.GasLimit = gasLimit;
  unsignedMessage.GasPremium = gasPremium;

  // sign message and push message
  const signedMessage = signer.transactionSignLotus(
    unsignedMessage,
    privateKey
  );
  return await WrappedLotusRPC.client.mpoolPush(signedMessage);
}
