import { createModel } from '@rematch/core';
import { Network, Message, MessageStatus } from 'src/types/app';
import produce, { Draft } from 'immer';
import {
  LotusRPCAdaptor,
  convertFilscoutMessages,
  pollingPendingMessage,
  getRematchMessagesKeyByStatus,
  getExtendedKeyBySeed,
  getAddressByNetwork,
  getAccountIndex,
  MessagePolling,
} from 'src/utils/app';
import { sortBy, reverse, findIndex, remove, max, find } from 'lodash';
import { getMessagesByAddress } from 'src/services/filscout';
import { getCoinPriceList } from 'src/services/coinmarketcap';
import { Cid, AppState, Account } from 'src/types/app';
import { RootModel } from '.';

const accountInitialState = {
  address: '',
  accountId: 0,
  extendedKey: {},
  balances: { [Network.Calibration]: 0, [Network.Mainnet]: 0 },
  balancesUSD: { [Network.Calibration]: 0, [Network.Mainnet]: 0 },
  messages: {
    [Network.Calibration]: {
      combinedMessages: [],
      fetchedMessages: [],
      pendingMessages: [],
      failedMessages: [],
    },
    [Network.Mainnet]: {
      combinedMessages: [],
      fetchedMessages: [],
      pendingMessages: [],
      failedMessages: [],
    },
  },
} as Account;

export const app = createModel<RootModel>()({
  state: {
    selectedNetwork: Network.Calibration,
    selectedAccountId: 0,
    priceInfo: null,
    accounts: [],
  } as AppState,
  reducers: {
    setPriceInfo(state: AppState, priceInfo: { [K in any]: any }) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.priceInfo = priceInfo;
      });
    },
    setSelectedAccountId(state: AppState, selectedAccountId: number) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.selectedAccountId = selectedAccountId;
      });
    },
    addAccount(state: AppState, account: Account) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.accounts = [...state.accounts, account];
      });
    },
    setSelectedNetwork(state: AppState, selectedNetwork: Network) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.selectedNetwork = selectedNetwork;
      });
    },
    setAddress(
      state: AppState,
      { accountId, address }: { accountId: number; address: string }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.accounts[accountId].address = address;
      });
    },
    setExtendedKey(state: AppState, extendedKey: { [key: string]: any }) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.accounts[state.selectedAccountId].extendedKey = extendedKey;
      });
    },
    setBalanceUSD(
      state: AppState,
      { accountId, network }: { accountId: number; network: Network }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const balance = state.accounts[accountId].balances[network];
        const balanceUSD =
          state.priceInfo.price * (balance * Math.pow(10, -18));
        draftState.accounts[accountId].balancesUSD[network] =
          Math.floor(balanceUSD * Math.pow(10, 4)) / Math.pow(10, 4);
      });
    },
    setBalance(
      state: AppState,
      {
        accountId,
        balance,
        network,
      }: { accountId: number; balance: number; network: Network }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        draftState.accounts[accountId].balances[network] = balance;
      });
    },
    combineMessages(state: AppState, { accountId }: { accountId: number }) {
      return produce(state, (draftState: Draft<AppState>) => {
        const accountIndex = getAccountIndex(state.accounts, accountId);
        const messagesByNetwork =
          state.accounts[accountIndex].messages[state.selectedNetwork];
        draftState.accounts[accountIndex].messages[
          state.selectedNetwork
        ].combinedMessages = reverse(
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
        accountId,
      }: {
        messages: Message[];
        messageStatus: MessageStatus;
        network: Network;
        accountId: number;
      }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const accountIndex = getAccountIndex(state.accounts, accountId);
        const draftMessagesKey = getRematchMessagesKeyByStatus(messageStatus);
        draftState.accounts[accountIndex].messages[network][draftMessagesKey] =
          reverse(sortBy(messages, (message) => message.datetime));
      });
    },
    removeMessageByStatus(
      state: AppState,
      {
        cid,
        messageStatus,
        network,
        accountId,
      }: {
        cid: Cid;
        messageStatus: MessageStatus;
        network: Network;
        accountId: number;
      }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const accountIndex = getAccountIndex(state.accounts, accountId);
        const draftMessagesByNetwork =
          draftState.accounts[accountIndex].messages[network];
        const draftMessagesKey = getRematchMessagesKeyByStatus(messageStatus);
        draftMessagesByNetwork[draftMessagesKey] = remove(
          draftMessagesByNetwork[draftMessagesKey],
          (message) => message.cid['/'] !== cid['/']
        );
      });
    },
    pruneDupMessages(state: AppState, { accountId }: { accountId: number }) {
      return produce(state, (draftState: Draft<AppState>) => {
        const accountIndex = getAccountIndex(state.accounts, accountId);
        const draftMessagesByNetwork =
          draftState.accounts[accountIndex].messages[state.selectedNetwork];
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
        accountId,
      }: {
        cid: Cid;
        network: Network;
        payload: Partial<Message>;
        messageStatus: MessageStatus;
        accountId: number;
      }
    ) {
      return produce(state, (draftState: Draft<AppState>) => {
        const accountIndex = getAccountIndex(state.accounts, accountId);
        const draftMessagesKey = getRematchMessagesKeyByStatus(messageStatus);
        const draftMessagesByNetwork =
          draftState.accounts[accountIndex].messages[network];
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
    async fetchBalanceUSD(
      {
        accountId,
        network,
      }: {
        accountId: number;
        network: Network;
      },
      rootState
    ) {
      if (!rootState.app.priceInfo) {
        const {
          data: { data: prices },
        } = await getCoinPriceList({});
        const filPrice = find(prices, (price) => price.symbol === 'FIL');
        dispatch.app.setPriceInfo(filPrice.quote.USD);
      }
      dispatch.app.setBalanceUSD({ accountId, network });
    },
    async fetchBalance({
      accountId,
      network,
      address,
    }: {
      accountId: number;
      network: Network;
      address: string;
    }) {
      const balance = await LotusRPCAdaptor.client[network].walletBalance(
        address
      );
      dispatch.app.setBalance({
        accountId,
        balance: Number(balance),
        network,
      });
    },
    async createAccount(
      {
        password,
        accountId,
      }: {
        password: string;
        accountId?: number;
      },
      rootState
    ) {
      return new Promise((resolve, reject) => {
        let newAccountIndex: number;
        if (typeof accountId === 'undefined') {
          if (rootState.app.accounts.length) {
            const accountIds = rootState.app.accounts.map(
              (account) => account.accountId
            );
            newAccountIndex = max(accountIds) + 1;
          } else {
            newAccountIndex = rootState.app.selectedAccountId;
          }
        } else {
          newAccountIndex = accountId;
        }
        getExtendedKeyBySeed(password, newAccountIndex)
          .then((extendedKey) => {
            const address = getAddressByNetwork(
              rootState.app.selectedNetwork,
              extendedKey.address
            );
            dispatch.app.addAccount({
              ...accountInitialState,
              accountId: newAccountIndex,
              address,
              extendedKey,
            });
            dispatch.app.setSelectedAccountId(newAccountIndex);
            resolve(extendedKey);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async fetchMessages(
      {
        firstTime = false,
        accountId,
      }: { firstTime?: boolean; accountId: number },
      rootState
    ) {
      const rawMessages =
        (await getMessagesByAddress({
          address: rootState.app.accounts[accountId].address,
        })) || [];
      const network = rootState.app.selectedNetwork;
      dispatch.app.setMessagesByStatus({
        accountId,
        messages: convertFilscoutMessages(rawMessages),
        messageStatus: MessageStatus.SUCCESS,
        network,
      });
      dispatch.app.pruneDupMessages({ accountId });
      dispatch.app.combineMessages({ accountId });
      if (firstTime) {
        // if refresh page, all uncompleted pending messages will start polling
        rootState.app.accounts[accountId].messages[
          network
        ].pendingMessages.forEach((pendingMessage) => {
          pollingPendingMessage({
            messagePollingInstance: new MessagePolling(
              LotusRPCAdaptor.client[network]
            ),
            network,
            accountId,
            pendingMessage,
            dispatch,
            rootState,
          });
        });
      }
    },
    async pushAndPollingPendingMessage(pendingMessage: Message, rootState) {
      const { selectedNetwork, selectedAccountId } = rootState.app;
      dispatch.app.setMessagesByStatus({
        accountId: selectedAccountId,
        messages: [
          pendingMessage,
          ...rootState.app.accounts[selectedAccountId].messages[selectedNetwork]
            .pendingMessages,
        ],
        messageStatus: MessageStatus.PENDING,
        network: selectedNetwork,
      });
      dispatch.app.combineMessages({ accountId: selectedAccountId });
      pollingPendingMessage({
        messagePollingInstance: new MessagePolling(
          LotusRPCAdaptor.client[selectedNetwork]
        ),
        accountId: selectedAccountId,
        network: selectedNetwork,
        pendingMessage,
        dispatch,
        rootState,
      });
    },
  }),
});
