import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import persistPlugin from '@rematch/persist';
import storage from 'redux-persist/lib/storage';
import { models, RootModel } from '.';

const persistConfig = {
  key: 'app',
  storage,
};

export const store = init({
  models,
  //@ts-ignore
  plugins: [persistPlugin(persistConfig)],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
