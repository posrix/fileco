import { createModel } from '@rematch/core';
import { Network } from 'src/types/app';
import produce, { Draft } from 'immer';
import { convertFilecoin, WrappedLotusRPC } from 'src/utils/app';
import { RootModel } from '.';

interface AppState {
  selectedNetwork: Network;
  address: string;
  extendedKey: { [key: string]: any };
  balance: number;
}

export const app = createModel<RootModel>()({
  state: {
    selectedNetwork: Network.Calibration,
    address: '',
    extendedKey: {},
    balance: 0,
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
        draftState.balance = convertFilecoin(balance);
      });
    },
  },
});
