import { createModel } from '@rematch/core';
import { Network, Message, MessageStatus } from 'src/types/app';
import produce, { Draft } from 'immer';
import {
  LotusRPCAdaptor,
  convertFilscoutMessages,
  pollingPendingMessage,
  getRematchMessagesKeyByStatus,
  MessagePolling,
} from 'src/utils/app';
import { sortBy, reverse, findIndex, remove } from 'lodash';
import { getMessagesByAddress } from 'src/services/filscout';
import { Cid, AppState } from 'src/types/app';
import { RootModel } from '.';

export const app = createModel<RootModel>()({
  state: {
    selectedNetwork: Network.Calibration,
    address: '',
    extendedKey: {},
    balance: 0,
    messages: {
      [Network.Calibration]: {
        combined: [],
        fetchedMessages: [],
        pendingMessages: [],
        failedMessages: [],
      },
      [Network.Mainnet]: {
        combined: [],
        fetchedMessages: [],
        pendingMessages: [],
        failedMessages: [],
      },
    },
  } as AppState,
  reducers: {
    setSelectedNetwork(state: AppState, selectedNetwork: Network) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.selectedNetwork = selectedNetwork;
      });
    },
    setAddress(state: AppState, address: string) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.address = address;
      });
    },
    setExtendedKey(state: AppState, extendedKey: { [key: string]: any }) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.extendedKey = extendedKey;
      });
    },
    setBalance(state: AppState, balance: number) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.balance = balance;
      });
    },
    combineMessages(state: AppState) {
      return produce(state, (draftState: Draft<AppState>) => {
        const messagesByNetwork = state.messages[state.selectedNetwork];
        draftState.messages[state.selectedNetwork].combined = reverse(
          sortBy(
            [
              ...messagesByNetwork.fetchedMessages,
              ...messagesByNetwork.pendingMessages,
              ...messagesByNetwork.failedMessages,
            ],
            (message) => message.datetime
          )
        );
      });
    },
    setMessagesByStatus(
      state: AppState,
      {
        messages,
        messageStatus,
        network,
      }: { messages: Message[]; messageStatus: MessageStatus; network: Network }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const draftMessagesKey = getRematchMessagesKeyByStatus(messageStatus);
        draftState.messages[network][draftMessagesKey] = reverse(
          sortBy(messages, (message) => message.datetime)
        );
      });
    },
    removeMessageByStatus(
      state: AppState,
      {
        cid,
        messageStatus,
        network,
      }: {
        cid: Cid;
        messageStatus: MessageStatus;
        network: Network;
      }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const draftMessagesByNetwork = draftState.messages[network];
        const draftMessagesKey = getRematchMessagesKeyByStatus(messageStatus);
        draftMessagesByNetwork[draftMessagesKey] = remove(
          draftMessagesByNetwork[draftMessagesKey],
          (message) => message.cid['/'] !== cid['/']
        );
      });
    },
    pruneDupMessages(state: AppState) {
      return produce(state, (draftState: Draft<AppState>) => {
        const draftMessagesByNetwork =
          draftState.messages[state.selectedNetwork];
        draftMessagesByNetwork.fetchedMessages.forEach((fetchedMessage) => {
          draftMessagesByNetwork.pendingMessages = remove(
            draftMessagesByNetwork.pendingMessages,
            (pendingMessage) =>
              pendingMessage.cid['/'] !== fetchedMessage.cid['/']
          );
          draftMessagesByNetwork.failedMessages = remove(
            draftMessagesByNetwork.failedMessages,
            (failedMessage) =>
              failedMessage.cid['/'] !== fetchedMessage.cid['/']
          );
        });
      });
    },
    updateMessageByStatus(
      state: AppState,
      {
        cid,
        network,
        payload,
        messageStatus,
      }: {
        cid: Cid;
        network: Network;
        payload: Partial<Message>;
        messageStatus: MessageStatus;
      }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const draftMessagesKey = getRematchMessagesKeyByStatus(messageStatus);
        const draftMessagesByNetwork = draftState.messages[network];
        const index = findIndex(
          draftMessagesByNetwork[draftMessagesKey],
          (message) => message.cid['/'] === cid['/']
        );
        draftMessagesByNetwork[draftMessagesKey][index] = {
          ...draftMessagesByNetwork[draftMessagesKey][index],
          ...payload,
        };
      });
    },
  },
  effects: (dispatch) => ({
    async fetchMessages(
      { firstTime = false }: { firstTime?: boolean },
      rootState
    ) {
      const rawMessages =
        (await getMessagesByAddress({ address: rootState.app.address })) || [];
      const network = rootState.app.selectedNetwork;
      dispatch.app.setMessagesByStatus({
        messages: convertFilscoutMessages(rawMessages),
        messageStatus: MessageStatus.SUCCESS,
        network,
      });
      dispatch.app.pruneDupMessages();
      dispatch.app.combineMessages();
      if (firstTime) {
        // if refresh page, all uncompleted pending messages will start polling
        rootState.app.messages[network].pendingMessages.forEach(
          (pendingMessage) => {
            pollingPendingMessage(
              new MessagePolling(LotusRPCAdaptor.client[network]),
              network,
              pendingMessage,
              dispatch,
              rootState
            );
          }
        );
      }
    },
    async pushAndPollingPendingMessage(pendingMessage: Message, rootState) {
      const network = rootState.app.selectedNetwork;
      dispatch.app.setMessagesByStatus({
        messages: [
          pendingMessage,
          ...rootState.app.messages[network].pendingMessages,
        ],
        messageStatus: MessageStatus.PENDING,
        network,
      });
      dispatch.app.combineMessages();
      pollingPendingMessage(
        new MessagePolling(LotusRPCAdaptor.client[network]),
        network,
        pendingMessage,
        dispatch,
        rootState
      );
    },
  }),
});
