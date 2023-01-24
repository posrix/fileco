import React from 'react';
import { useHistory } from 'react-router-dom';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import {
  Container,
  ContentContainer,
  WalletEntryContainer,
  WalletEntryTitle,
  WalletEntrySubTitle,
  CoverContainer,
  WalletEntryFlexWrapper,
  Title,
  Slogan,
} from './styled';

const Welcome = () => {
  const history = useHistory();

  return (
    <Container>
      <CoverContainer>
        <div>
          <Title>Fileco</Title>
          <Slogan>
            <FormattedMessage id="welcome.slogan" />
          </Slogan>
        </div>
      </CoverContainer>
      <ContentContainer>
        <WalletEntryContainer onClick={() => history.push('/set-password')}>
          <WalletEntryFlexWrapper>
            <Icon glyph="add-wallet" size={32} />
            <div>
              <WalletEntryTitle>
                <FormattedMessage id="welcome.wallet.entry.create.title" />
              </WalletEntryTitle>
              <WalletEntrySubTitle>
                <FormattedMessage id="welcome.wallet.entry.create.subTitle" />
              </WalletEntrySubTitle>
            </div>
          </WalletEntryFlexWrapper>
          <Icon glyph="arrow-right" size={24} color="#BDBDBD" />
        </WalletEntryContainer>
        <WalletEntryContainer onClick={() => history.push('/import-wallet')}>
          <WalletEntryFlexWrapper>
            <Icon glyph="import-wallet" size={32} />
            <div>
              <WalletEntryTitle>
                <FormattedMessage id="welcome.wallet.entry.import.title" />
              </WalletEntryTitle>
              <WalletEntrySubTitle>
                <FormattedMessage id="welcome.wallet.entry.import.subTitle" />
              </WalletEntrySubTitle>
            </div>
          </WalletEntryFlexWrapper>
          <Icon glyph="arrow-right" size={24} color="#BDBDBD" />
        </WalletEntryContainer>
      </ContentContainer>
    </Container>
  );
};

export default Welcome;
