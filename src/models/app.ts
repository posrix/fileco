import { createModel } from '@rematch/core';
import { Network, Message } from 'src/types/app';
import produce, { Draft } from 'immer';
import {
  WrappedLotusRPC,
  convertFilscoutMessages,
  SearchMessage,
} from 'src/utils/app';
import { sortBy, reverse, findIndex, remove } from 'lodash';
import { getMessagesByAddress } from 'src/services/filscout';
import { Cid } from 'src/types/app';
import { RootModel } from '.';

interface AppState {
  selectedNetwork: Network;
  address: string;
  extendedKey: { [key: string]: any };
  balance: number;
  messages: Message[];
}

export const app = createModel<RootModel>()({
  state: {
    selectedNetwork: Network.Calibration,
    address: '',
    extendedKey: {},
    balance: 0,
    messages: [],
  } as AppState,
  reducers: {
    setSelectedNetwork(state: AppState, selectedNetwork: Network) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.selectedNetwork = selectedNetwork;
      });
    },
    setAddress(state: AppState, address: string) {
      new WrappedLotusRPC(state.selectedNetwork, true);
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
    setMessages(
      state: AppState,
      {
        messages,
        keepPendingMessages = false,
      }: { messages: Message[]; keepPendingMessages?: boolean }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const latestMessages = messages;
        if (keepPendingMessages) {
          const pendingMesasges = state.messages.filter(
            (message) => message.pending
          );
          latestMessages.unshift(...pendingMesasges);
        }
        draftState.messages = reverse(
          sortBy(latestMessages, (message) => message.datetime)
        );
      });
    },
    removeMessage(state: AppState, cid: Cid) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.messages = remove(
          draftState.messages,
          (message) => message.cid['/'] !== cid['/']
        );
      });
    },
    updateMessage(state: AppState, payload: Partial<Message>) {
      return produce(state, (draftState: Draft<AppState>) => {
        const index = findIndex(
          draftState.messages,
          (message) => message.cid['/'] === payload.cid['/']
        );
        draftState.messages[index] = {
          ...draftState.messages[index],
          ...payload,
        };
      });
    },
  },
  effects: (dispatch) => ({
    async fetchMessages(address: string) {
      const rawMessages = (await getMessagesByAddress({ address })) || [];
      const messages = convertFilscoutMessages(rawMessages);
      console.log('messages', messages);
      dispatch.app.setMessages({ messages });
      return messages;
    },
    async incrementalPushMessage(message: Message, rootState) {
      dispatch.app.setMessages({
        messages: [message, ...rootState.app.messages],
      });
      new SearchMessage().byCid({
        cid: message.cid,
        enablePolling: true,
        onSuccess: (searchedMessage) => {
          dispatch.app.updateMessage({
            cid: message.cid,
            height: searchedMessage.Height,
            pending: false,
          });
        },
        onError: () => {
          // remove message if failed
          dispatch.app.removeMessage(message.cid);
        },
      });
    },
  }),
});
