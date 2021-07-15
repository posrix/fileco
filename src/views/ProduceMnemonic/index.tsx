import React, { useState, useEffect } from 'react';
import ActionFooter from 'src/components/ActionFooter';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Icon from 'src/components/Icon';
import ActionHeader from 'src/components/ActionHeader';
import { PATH } from 'src/utils/constants';
import { setLocalStorage } from 'src/utils/app';
import signer from 'src/utils/signer';
import {
  Container,
  Mnemonic,
  MnemonicLockedPlaceholder,
  Warning,
  WarningContainer,
} from './styled';

const ProduceMnemonic: React.FC = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [lock, setLock] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const mnemonic = signer.generateMnemonic();
    const extendedKey = signer.keyDerive(mnemonic, PATH, '');
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
