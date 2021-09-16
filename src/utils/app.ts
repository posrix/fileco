import {
  Network,
  Account,
  SetPersistenceMemory,
  GetPersistenceMemory,
} from 'src/types/app';
import { findIndex } from 'lodash';
import signer from 'src/utils/signer';
import { IS_PRODUCTION, DEV_PASSWORD } from './constants';

const passworder = require('browser-passworder');

export const getLocalStorage = (storageName: string) => {
  return window.localStorage.getItem(storageName) || '';
};

export const setLocalStorage = (storageName: string, storageValue: string) => {
  window.localStorage.setItem(storageName, storageValue);
};

export const removeLocalStorage = (storageName: string) => {
  window.localStorage.removeItem(storageName);
};

export const setPersistenceMemory = ({
  event,
  entity,
}: SetPersistenceMemory) => {
  chrome.runtime.sendMessage({ type: event, ...entity });
};

export const getPersistenceMemory = ({
  event,
  key,
}: GetPersistenceMemory): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (IS_PRODUCTION) {
      chrome.runtime.sendMessage({ type: event }, (memory) => {
        if (memory[key]) {
          resolve(memory[key]);
        } else {
          reject('Memory key not exist');
        }
      });
    } else {
      resolve(DEV_PASSWORD);
    }
  });
};

export function getMnenomicByPassword(password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    passworder
      .decrypt(password, getLocalStorage('mnemonic'))
      .then((mnemonic: string) => {
        resolve(mnemonic);
      })
      .catch((error: string) => {
        reject(error);
      });
  });
}

export function getExtendedKeyBySeed(
  password: string,
  accountId: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    passworder
      .decrypt(password, getLocalStorage('mnemonic'))
      .then((mnemonic: string) => {
        const extendedKey = signer.keyDerive(
          mnemonic,
          `m/44'/461'/${accountId}'/0/0`,
          ''
        );
        resolve(extendedKey);
      })
      .catch((error: string) => {
        reject(error);
      });
  });
}

export function getAccountIndex(
  accounts: Account[],
  accountId: number
): number {
  return findIndex(accounts, (account) => account.accountId === accountId);
}

export function getAddressByNetwork(network: Network, address: string): string {
  return network === Network.Calibration
    ? address.indexOf('f') == 0
      ? address.replace('f', 't')
      : address
    : address.indexOf('t') == 0
    ? address.replace('t', 'f')
    : address;
}

export function convertToFilUnit(value: number | string, decimal: number = 4) {
  if (typeof value === 'string') {
    value = Number(value);
  }
  if (value <= 0) {
    return '0 FIL';
  } else {
    return (
      Math.floor(value * Math.pow(10, -18) * Math.pow(10, decimal)) /
        Math.pow(10, decimal) +
      ' FIL'
    );
  }
}

export function convertByUnit(value: number | string, decimal: number = 4) {
  if (typeof value === 'string') {
    value = Number(value);
  }
  if (value <= 0) {
    return '0 FIL';
  }
  const filScope = Math.pow(10, 18);
  const nanoScope = Math.pow(10, 9);
  const attoScope = 0;
  if (value >= filScope) {
    return (
      Math.floor(value * Math.pow(10, -18) * Math.pow(10, decimal)) /
        Math.pow(10, decimal) +
      ' FIL'
    );
  } else if (value <= filScope && value >= nanoScope) {
    return (
      Math.floor(value * Math.pow(10, -9) * Math.pow(10, decimal)) /
        Math.pow(10, decimal) +
      ' nanoFIL'
    );
  } else if (value <= nanoScope && value > attoScope) {
    return (
      Math.floor(value * Math.pow(10, decimal)) / Math.pow(10, decimal) +
      ' attoFIL'
    );
  }
}

export function addressEllipsis(address: string) {
  const head = address.substring(0, 7);
  const tail = address.substring(address.length - 4, address.length);
  return `${head}...${tail}`;
}
