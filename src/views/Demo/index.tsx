import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
//@ts-ignore
import { BrowserProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
//@ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';
import { Container, Section, Content, Message } from './styled';

//@ts-ignore
window.global = window;
//@ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

const signer = require('src/signer');
const pbkdf2 = require('pbkdf2');
const aesjs = require('aes-js');

function encrypt() {
  var key_256 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 256 / 8, 'sha512');
  console.log('key_256', key_256);
  var text = 'Text may be any length you wish, no padding is required.';
  var textBytes = aesjs.utils.utf8.toBytes(text);

  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  // To print or store the binary data, you may convert it to hex
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  console.log('encryptedHex', encryptedHex);
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(decryptedText);
  // chrome.storage.sync.set({ encryptedHex: encryptedHex }, function () {
  //   console.log('Value is set to ' + encryptedHex);
  // });

  chrome.storage.sync.get(['encryptedHex'], function (result) {
    console.log('Value currently is ' + result.encryptedHex);
  });
}

function passwordMnemonic() {
  const mnemonic = signer.generateMnemonic();
  const password = 'pass';
  const path = "m/44'/461'/0'/0/0";
  const key = signer.keyDerive(mnemonic, path, password);
  console.log(mnemonic, key);
}

const NET: 'testnet' | 'mainnet' = 'testnet';
const __LOTUS_RPC_ENDPOINT__ = `http://192.168.1.233:${
  NET === 'testnet' ? '1301' : '1234'
}/rpc/v0`;
const __LOTUS_AUTH_TOKEN__ =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.KTfmCTjHOK0AR3HRhnu1D5jrDYTcDDmeGxZk8CHdTfk';

const provider = new BrowserProvider(__LOTUS_RPC_ENDPOINT__, {
  token: __LOTUS_AUTH_TOKEN__,
});

const client = new LotusRPC(provider, { schema: mainnet.fullNode });

const TO = 'f1yvjes5pnl5h4h5eycljhfbnxvall5ac2mufchjq';
const FROM =
  't3wrlr4fzq2ca3xtunadwls33g6zxwm6tj3xqp6gukpdsjgnf4relgshvw3a6lhlue6nkhnnws5am5gcg3dfla';

function Demo() {
  useEffect(() => {
    chainHead();
    walletBalance();
    // NET === 'testnet' && mpoolPushMessage();
    stateListMessages();
    // walletNew();
  }, []);

  async function walletNew() {
    const key = await client.walletNew('secp256k1');
    console.log('walletNew', key);
  }

  const [height, setHeight] = useState(0);
  async function chainHead() {
    const { Height: height } = await client.chainHead();
    setHeight(height);
  }

  const [balance, setBalance] = useState('');
  async function walletBalance() {
    const balance = await client.walletBalance(FROM);
    setBalance(balance);
  }

  const [pushedMessage, setPushedMessage] = useState('');
  async function mpoolPushMessage() {
    const pushedMessage = await client.mpoolPushMessage(
      {
        From: FROM,
        Method: 0,
        To: TO,
        Value: '12000',
        GasFeeCap: '10000000000',
        GasLimit: 10000000000,
        GasPremium: '1000000000',
      } as any,
      { MaxFee: '0' }
    );
    setPushedMessage(JSON.stringify(pushedMessage, null, 1));
  }

  const [messages, setMessages] = useState([]);

  async function stateListMessages() {
    const listMessages = await client.stateListMessages(
      {
        From: FROM,
        To: TO,
      },
      [],
      NET === 'mainnet' ? 825000 : 312000
    );
    if (!listMessages) return;
    const chainMessages = await Promise.all(
      listMessages.map(async (cid) => {
        return await client.chainGetMessage(cid);
      })
    );
    setMessages(chainMessages || []);
  }

  return (
    <Container>
      <Box mb={2}>You are using {NET}</Box>
      <Box mb={2}>Your account is {FROM}</Box>
      <Section>
        <Button variant="contained" onClick={chainHead}>
          Height
        </Button>
        <Content>{height}</Content>
      </Section>
      <Section>
        <Button variant="contained" onClick={walletBalance}>
          Account Balance
        </Button>
        <Content>{balance}</Content>
      </Section>
      <Section>
        <Button variant="contained" onClick={mpoolPushMessage}>
          Send Message
        </Button>
        <Content>{pushedMessage}</Content>
      </Section>
      <Section>
        <Button variant="contained" onClick={stateListMessages}>
          Activity
        </Button>
        <List>
          {messages && messages.length
            ? messages.map((message, i) => (
                <Message key={i}>
                  <Box>CID: {message.CID['/']}</Box>
                  <Box>From: {message.From}</Box>
                  <Box>To: {message.To}</Box>
                  <Box>GasFeeCap: {message.GasFeeCap}</Box>
                  <Box>GasLimit: {message.GasLimit}</Box>
                  <Box>GasPremium: {message.GasPremium}</Box>
                  <Box>Method: {message.Method}</Box>
                  <Box>Nonce: {message.Nonce}</Box>
                  <Box>Value: {message.Value}</Box>
                </Message>
              ))
            : 'no actvity'}
        </List>
      </Section>
    </Container>
  );
}

export default Demo;
