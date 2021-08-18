import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { LOTUS_RPC_ENDPOINT, LOTUS_AUTH_TOKEN, PATH } from './constants';
import {
  Network,
  Cid,
  Message,
  MsgLookup,
  MessageStatus,
  Account,
} from 'src/types/app';
import { RootState, Dispatch } from 'src/models/store';
import { store } from 'src/models/store';
import signer from 'src/utils/signer';
import { findIndex } from 'lodash';

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

export class LotusRPCAdaptor {
  static client:
    | Record<keyof typeof Network, LotusRPC>
    | { [K in any]: never } = {};

  constructor(network: Network) {
    const provider = new BrowserProvider(
      network === Network.Mainnet
        ? LOTUS_RPC_ENDPOINT.MAINNET
        : LOTUS_RPC_ENDPOINT.CALIBRATION,
      {
        token: LOTUS_AUTH_TOKEN,
      }
    );
    LotusRPCAdaptor.client[network] = new LotusRPC(provider, {
      schema: mainnet.fullNode,
    });
  }
}

export function getExtendedKeyBySeed(
  password: string,
  accountId: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    passworder
      .decrypt(password, getLocalStorage('mnemonic'))
      .then((result: any) => {
        const extendedKey = signer.keyDerive(
          result,
          `m/44'/461'/${accountId}'/0/0`,
          ''
        );
        resolve(extendedKey);
      })
      .catch((error: string) => {
        reject(error);
      });
  });
}

export function getAccountIndex(
  accounts: Account[],
  accountId: number
): number {
  return findIndex(accounts, (account) => account.accountId === accountId);
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

export function getFilByUnit(value: number | string, decimal: number = 4) {
  if (typeof value === 'string') {
    value = Number(value);
  }
  if (value <= 0) {
    return '0 FIL';
  }
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

export function getRematchMessagesKeyByStatus(messageStatus: MessageStatus) {
  switch (messageStatus) {
    case MessageStatus.SUCCESS:
      return 'fetchedMessages';
    case MessageStatus.FAILED:
      return 'failedMessages';
    case MessageStatus.PENDING:
      return 'pendingMessages';
    default:
      throw new Error('Message status not exist');
  }
}

export function pollingPendingMessage({
  messagePollingInstance,
  network,
  accountId,
  pendingMessage,
  dispatch,
  rootState,
}: {
  messagePollingInstance: MessagePolling;
  network: Network;
  accountId: number;
  pendingMessage: Message;
  dispatch: Dispatch;
  rootState: RootState;
}) {
  messagePollingInstance.byCid({
    cid: pendingMessage.cid,
    enablePolling: true,
    onSuccess: () => {
      dispatch.app.removeMessageByStatus({
        accountId,
        cid: pendingMessage.cid,
        messageStatus: MessageStatus.PENDING,
        network,
      });
      dispatch.app.fetchMessages({});
    },
    onError: () => {
      dispatch.app.removeMessageByStatus({
        accountId,
        cid: pendingMessage.cid,
        messageStatus: MessageStatus.PENDING,
        network,
      });
      dispatch.app.setMessagesByStatus({
        accountId,
        messages: [
          { ...pendingMessage, status: MessageStatus.FAILED },
          ...rootState.app.accounts[accountId].messages[network].failedMessages,
        ],
        messageStatus: MessageStatus.FAILED,
        network,
      });
      dispatch.app.combineMessages();
    },
  });
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
  const estimateMessageGas = await LotusRPCAdaptor.client[
    store.getState().app.selectedNetwork
  ].gasEstimateMessageGas(unsignedMessage, { MaxFee: '0' }, []);
  return {
    gasFeeCap: estimateMessageGas.GasFeeCap,
    gasLimit: estimateMessageGas.GasLimit,
    gasPremium: estimateMessageGas.GasPremium,
  };
}

export class MessagePolling {
  constructor(lotusRPCClient: LotusRPC) {
    this.lotusRPCClient = lotusRPCClient;
  }

  private elapse: number = 0;

  private lotusRPCClient: LotusRPC;

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
    const searchedMessage = await this.lotusRPCClient.stateSearchMsg(cid);
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
  const tipSet = await LotusRPCAdaptor.client[
    store.getState().app.selectedNetwork
  ].chainGetTipSetByHeight(Height, TipSet);
  return tipSet.Blocks[0].Timestamp;
}

export function convertFilscoutMessages(rawMessages: any): Message[] {
  return rawMessages.map((rawMessage: any) => ({
    cid: { '/': rawMessage['cid'] },
    from: rawMessage['from'],
    to: rawMessage['to'],
    value: Number(rawMessage['value'].split(' ')[0]) * 1e18,
    datetime: rawMessage['timeFormat'],
    height: rawMessage['height'],
    status: MessageStatus.SUCCESS,
  }));
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
  const LotusRPCClient =
    LotusRPCAdaptor.client[store.getState().app.selectedNetwork];
  // get nonce and compare value with balance
  const actor = await LotusRPCClient.stateGetActor(from, []);
  if (Number(actor.Balance) < value) {
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
  return await LotusRPCClient.mpoolPush(signedMessage);
}
