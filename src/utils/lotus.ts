//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
import { LOTUS_RPC_ENDPOINT, LOTUS_AUTH_TOKEN } from './constants';
import signer from 'src/utils/signer';
import { store } from 'src/models/store';
import { RootState, Dispatch } from 'src/models/store';
import { Network, Cid, Message, MsgLookup, MessageStatus } from 'src/types/app';

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

export async function getEstimateGas(unsignedMessage: any) {
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
          onError && onError();
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
      onSuccess && onSuccess(searchedMessage);
      return searchedMessage;
    }
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
  return new Promise((resolve, reject) => {
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
        dispatch.app.fetchMessages({ accountId });
        resolve(pendingMessage);
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
            ...rootState.app.accounts[accountId].messages[network]
              .failedMessages,
          ],
          messageStatus: MessageStatus.FAILED,
          network,
        });
        dispatch.app.combineMessages({ accountId });
        reject(pendingMessage);
      },
    });
  });
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
    status:
      rawMessage['exitCodeName'] === 'OK'
        ? MessageStatus.SUCCESS
        : MessageStatus.FAILED,
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
}): Promise<Cid> {
  return new Promise(async (resolve, reject) => {
    const LotusRPCClient =
      LotusRPCAdaptor.client[store.getState().app.selectedNetwork];

    const unsignedMessage = constructUnsignedMessage({ from, to, value });

    // get nonce and compare value with balance
    const actor = await LotusRPCClient.stateGetActor(from, []);
    if (Number(actor.Balance) < value) {
      throw new Error('transfer amount is greater than balance');
    }
    const { selectedAccountId } = store.getState().app;
    const { nonce } = store.getState().app.accounts[selectedAccountId];
    if (nonce === undefined) {
      store.dispatch.app.setNonce({
        accountId: selectedAccountId,
        nonce: actor.Nonce,
      });
      unsignedMessage.Nonce = actor.Nonce;
    } else {
      unsignedMessage.Nonce = nonce + 1;
      store.dispatch.app.setNonce({
        accountId: selectedAccountId,
        nonce: nonce + 1,
      });
    }

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
    const cid = await LotusRPCClient.mpoolPush(signedMessage);
    resolve(cid);
  });
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
