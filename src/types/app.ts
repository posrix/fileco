export enum Language {
  en = 'en',
  zh = 'zh',
}

export enum Network {
  Mainnet = 'Mainnet',
  Calibration = 'Calibration',
}

export interface Message {
  cid: string;
  datetime: string;
  from: string;
  to: string;
  value: number;
}
