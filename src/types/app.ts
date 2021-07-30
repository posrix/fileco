export enum Language {
  en = 'en',
  zh = 'zh',
}

export enum Network {
  Mainnet = 'Mainnet',
  Calibration = 'Calibration',
}

export interface Message {
  cid: Cid;
  datetime: string;
  from: string;
  to: string;
  value: number;
  pending: boolean;
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
