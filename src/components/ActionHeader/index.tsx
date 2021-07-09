import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TitleContainer, Title, SubTitle } from './styled';

export interface ActionHeaderProps {
  titleLocaleId: string;
  subtitleLocaleId: string;
  gutter?: number;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({
  titleLocaleId,
  subtitleLocaleId,
  gutter,
}) => {
  return (
    <TitleContainer gutter={gutter}>
      <Title>
        <FormattedMessage id={titleLocaleId} />
      </Title>
      <SubTitle>
        <FormattedMessage id={subtitleLocaleId} />
      </SubTitle>
    </TitleContainer>
  );
};

export default ActionHeader;
