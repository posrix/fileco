import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import {
  Container,
  WalletEntryContainer,
  WalletEntryTitle,
  WalletEntrySubTitle,
  CoverContainer,
  Title,
  Slogan,
} from './styled';

const Welcome = () => {
  const history = useHistory();

  return (
    <>
      <CoverContainer>
        <Box>
          <Title>Keystore</Title>
          <Title>Lite</Title>
          <Slogan>
            <FormattedMessage id="welcome.slogan" />
          </Slogan>
        </Box>
      </CoverContainer>
      <Container>
        <WalletEntryContainer onClick={() => history.push('/set-password')}>
          <Icon glyph="add-wallet" width={26} height={21} />
          <Box>
            <WalletEntryTitle>
              <FormattedMessage id="welcome.wallet.entry.create.title" />
            </WalletEntryTitle>
            <WalletEntrySubTitle>
              <FormattedMessage id="welcome.wallet.entry.create.title.sub" />
            </WalletEntrySubTitle>
          </Box>
        </WalletEntryContainer>
        <WalletEntryContainer>
          <Icon glyph="import-wallet" width={26} height={21} />
          <Box>
            <WalletEntryTitle>
              <FormattedMessage id="welcome.wallet.entry.import.title" />
            </WalletEntryTitle>
            <WalletEntrySubTitle>
              <FormattedMessage id="welcome.wallet.entry.import.title.sub" />
            </WalletEntrySubTitle>
          </Box>
        </WalletEntryContainer>
      </Container>
    </>
  );
};

export default Welcome;
