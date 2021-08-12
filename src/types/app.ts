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

export interface AppState {
  selectedNetwork: Network;
  address: string;
  extendedKey: { [key: string]: any };
  balance: number;
  messages: Message[];
  fetchedMessages: Message[];
  pendingMessages: Message[];
  failedMessages: Message[];
}
