import React, { useState, useEffect } from 'react';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Icon from 'src/components/Icon';
import CommonPageHeader from 'src/components/CommonPageHeader';
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
    setLocalStorage('temporary-mnemonic', mnemonic);
    setMnemonic(mnemonic);
  }, []);

  return (
    <Container>
      <CommonPageHeader
        titleLocaleId="mnemonic.produce.title"
        subTitleLocaleId="mnemonic.produce.subTitle"
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
      <CommonPageFooter onConfirm={() => history.push('/verify-mnemonic')} />
    </Container>
  );
};

export default ProduceMnemonic;
