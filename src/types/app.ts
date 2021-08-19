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
  address: string;
  extendedKey: { [key: string]: any };
  balances: Record<keyof typeof Network, number>;
  messages: Record<keyof typeof Network, Messages>;
  accountId: number;
}

export interface AppState {
  selectedNetwork: Network;
  selectedAccountId: number;
  accounts: Account[];
}
