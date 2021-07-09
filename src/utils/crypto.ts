// @ts-ignore
import * as pbkdf2 from 'pbkdf2';
// @ts-ignore
import * as aesjs from 'aes-js';

export function generateAes256Key(password: string) {
  return pbkdf2.pbkdf2Sync(password, 'salt', 1, 256 / 8, 'sha512');
}

export function encrypt(key: string, text: string) {
  const aesCtr = new aesjs.ModeOfOperation.ctr(key);
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const encryptedBytes = aesCtr.encrypt(textBytes);
  // To print or store the binary data, you may convert it to hex
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

export function decrypt(key: string, encryptedHex: string) {
  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  const aesCtr = new aesjs.ModeOfOperation.ctr(key);
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  // Convert our bytes back into text
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}
