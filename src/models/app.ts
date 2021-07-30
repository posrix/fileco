import { createModel } from '@rematch/core';
import { Network, Message } from 'src/types/app';
import produce, { Draft } from 'immer';
import { WrappedLotusRPC } from 'src/utils/app';
import { sortBy, reverse, flatten } from 'lodash';
import * as moment from 'moment';
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
  },
  effects: (dispatch) => ({
    async fetchMessages(address: string) {
      // TODO get decent height for performance improvement
      const height = 73232;
      const messagesSet = (
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
      if (messagesSet.length) {
        const messages = (await Promise.all(
          flatten(messagesSet).map(async (cid: any) => {
            const messageFromSearch =
              await WrappedLotusRPC.client.stateSearchMsg(cid);
            const messageFromGet = await WrappedLotusRPC.client.chainGetMessage(
              cid
            );
            const tipSet = await WrappedLotusRPC.client.chainGetTipSetByHeight(
              messageFromSearch.Height,
              messageFromSearch.TipSet
            );
            const timestamp = tipSet.Blocks[0].Timestamp;
            return {
              cid: messageFromGet['CID']['/'],
              from: messageFromGet['From'],
              to: messageFromGet['To'],
              value: messageFromGet['Value'],
              datetime: moment.unix(timestamp).format('YYYY/MM/DD h:mm:ss'),
            };
          })
        )) as Message[];
        dispatch.app.setMessages(messages);
        return messages;
      }
    },
  }),
});
