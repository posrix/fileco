export enum Language {
  en = 'en',
  zh = 'zh',
}

export enum Network {
  Mainnet = 'Mainnet',
  Calibration = 'Calibration',
}

export enum MessageStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface Message {
  cid: Cid;
  datetime: string;
  from: string;
  to: string;
  value: number;
  height: number;
  status: MessageStatus;
}

export type Cid = { '/': string };

export interface TipSet {
  Blocks: Array<any>;
  Cids: Array<Cid>;
  Height: number;
}

export interface MessageReceipt {
  ExitCode: number;
  GasUsed: number;
  Return: string;
}

export interface MsgLookup {
  Height: number;
  Message: Cid;
  Receipt: MessageReceipt;
  ReturnDec: any;
  TipSet: Cid[];
}

interface Messages {
  combinedMessages: Message[];
  fetchedMessages: Message[];
  pendingMessages: Message[];
  failedMessages: Message[];
}

export interface Account {
  idAddresses: Record<keyof typeof Network, string>;
  address: string;
  balances: Record<keyof typeof Network, number>;
  balancesUSD: Record<keyof typeof Network, number>;
  messages: Record<keyof typeof Network, Messages>;
  accountId: number;
}

export interface AppState {
  priceInfo: { [K in any]: any };
  selectedNetwork: Network;
  selectedAccountId: number;
  accounts: Account[];
}

export interface SetPersistenceMemory {
  event: 'SET_PASSWORD';
  entity: { [key: string]: string };
}

export interface GetPersistenceMemory {
  event: 'GET_PASSWORD';
  key: string;
}
