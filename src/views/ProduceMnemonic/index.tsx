import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ActionFooter from 'src/components/ActionFooter';
import { FormattedMessage } from 'react-intl';
import {
  Container,
  Mnemonic,
  Title,
  SubTitle,
  Warning,
  WarningContainer,
} from './styled';

//@ts-ignore
window.global = window;
//@ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

const signer = require('src/utils/signer');

const ProduceMnemonic: React.FC = () => {
  const history = useHistory();
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(['password'], function (result) {
      console.log('password currently is ' + result.password);
      const mnemonic = signer.generateMnemonic();
      const password = result.password;
      const path = "m/44'/461'/0'/0/0";
      const key = signer.keyDerive(mnemonic, path, password);
      console.log(mnemonic, key);
      setMnemonic(mnemonic);
    });
  }, []);

  return (
    <Container>
      <Title>
        <FormattedMessage id="mnemonic.produce.title" />
      </Title>
      <SubTitle>
        <FormattedMessage id="mnemonic.produce.subtitle" />
      </SubTitle>
      <Mnemonic>{mnemonic}</Mnemonic>
      <WarningContainer>
        <Warning>
          <FormattedMessage id="mnemonic.produce.warning1" />
        </Warning>
        <Warning>
          <FormattedMessage id="mnemonic.produce.warning2" />
        </Warning>
        <Warning>
          <FormattedMessage id="mnemonic.produce.warning3" />
        </Warning>
      </WarningContainer>
      <ActionFooter nextRoute="/" />
    </Container>
  );
};

export default ProduceMnemonic;
