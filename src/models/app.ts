import { createModel } from '@rematch/core';
import { Network, Message } from 'src/types/app';
import produce, { Draft } from 'immer';
import {
  WrappedLotusRPC,
  getMessageByCid,
  searchMessageByCid,
} from 'src/utils/app';
import { sortBy, reverse, flatten, findIndex, remove } from 'lodash';
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
    setMessages(state: AppState, messages: Message[]) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.messages = reverse(
          sortBy(messages, (message) => message.datetime)
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
    setMessagePendingStatus(
      state: AppState,
      { cid, pending }: { cid: Cid; pending: boolean }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const index = findIndex(
          draftState.messages,
          (message) => message.cid['/'] === cid['/']
        );
        draftState.messages[index] = {
          ...draftState.messages[index],
          pending,
        };
      });
    },
  },
  effects: (dispatch) => ({
    async fetchMessages(address: string) {
      // TODO get decent height for performance improvement
      const height = 73232;
      const relatedCids = (
        (await Promise.all([
          WrappedLotusRPC.client.stateListMessages(
            {
              From: address,
            },
            [],
            height
          ),
          WrappedLotusRPC.client.stateListMessages(
            {
              To: address,
            },
            [],
            height
          ),
        ])) as any[]
      ).filter((i) => i);
      if (relatedCids.length) {
        const messages = await Promise.all(
          flatten(relatedCids).map(
            async (cid: Cid) => await getMessageByCid(cid)
          )
        );
        dispatch.app.setMessages(messages);
        return messages;
      }
    },
    async incrementalPushMessage(message: Message, rootState) {
      dispatch.app.setMessages([message, ...rootState.app.messages]);

      searchMessageByCid({
        cid: message.cid,
        enablePolling: true,
        onSuccess: () => {
          dispatch.app.setMessagePendingStatus({
            cid: message.cid,
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
