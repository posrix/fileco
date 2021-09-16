import React from 'react';
import Icon from 'src/components/Icon';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { FormattedMessage } from 'react-intl';
import { convertToFilUnit } from 'src/utils/app';
import { Container, AddIconContainer, SentText } from './styled';

interface TransferSentProps {
  amount: number;
}

const TransferSent: React.FC<TransferSentProps> = ({ amount }) => {
  const hasAmount = !!amount;

  if (!hasAmount) {
    return null;
  }

  return (
    <Container>
      <AddIconContainer>
        <Icon glyph="check" color="#4BD15D" />
      </AddIconContainer>
      <SentText>
        <FormattedMessage
          id="transfer.sent"
          values={{ amount: convertToFilUnit(amount) }}
        />
      </SentText>
      <CommonPageFooter onlyBack backRoute="/home" />
    </Container>
  );
};

export default TransferSent;
