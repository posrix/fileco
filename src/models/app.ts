import { createModel } from '@rematch/core';
import { Network } from 'src/types/app';
import { RootModel } from '.';

interface AppState {
  selectedNetwork: Network;
}

export const app = createModel<RootModel>()({
  state: {
    selectedNetwork: Network.Calibration,
  } as AppState,
  reducers: {
    setSelectedNetwork(state: AppState, selectedNetwork: Network) {
      return {
        ...state,
        selectedNetwork,
      };
    },
  },
});
