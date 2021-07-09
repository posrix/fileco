import React, { useState, useEffect } from 'react';
import ActionFooter from 'src/components/ActionFooter';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Icon from 'src/components/Icon';
import ActionHeader from 'src/components/ActionHeader';
import {
  Container,
  Mnemonic,
  MnemonicLockedPlaceholder,
  Warning,
  WarningContainer,
} from './styled';
import { setLocalStorage } from 'src/utils/app';

//@ts-ignore
window.global = window;
//@ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

const signer = require('src/utils/signer');

const ProduceMnemonic: React.FC = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [lock, setLock] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const mnemonic = signer.generateMnemonic();
    const path = "m/44'/461'/0'/0/0";
    const extendedKey = signer.keyDerive(mnemonic, path, '');
    setLocalStorage('address', extendedKey.address);
    setLocalStorage('mnemonic', mnemonic);
    setMnemonic(mnemonic);
  }, []);

  return (
    <Container>
      <ActionHeader
        titleLocaleId="mnemonic.produce.title"
        subtitleLocaleId="mnemonic.produce.subtitle"
      />
      {lock ? (
        <MnemonicLockedPlaceholder onClick={() => setLock(false)}>
          <Icon glyph="lock" />
          <FormattedMessage id="mnemonic.produce.lock" />
        </MnemonicLockedPlaceholder>
      ) : (
        <Mnemonic>{mnemonic}</Mnemonic>
      )}
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
      <ActionFooter onConfirm={() => history.push('/verify-mnemonic')} />
    </Container>
  );
};

export default ProduceMnemonic;
