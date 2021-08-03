import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TitleContainer, Title, SubTitle } from './styled';

export interface CommonPageHeaderProps {
  titleLocaleId: string;
  subtitleLocaleId?: string;
  gutter?: number;
}

const CommonPageHeader: React.FC<CommonPageHeaderProps> = ({
  titleLocaleId,
  subtitleLocaleId,
  gutter,
}) => {
  return (
    <TitleContainer gutter={gutter}>
      <Title>
        <FormattedMessage id={titleLocaleId} />
      </Title>
      {subtitleLocaleId && (
        <SubTitle>
          <FormattedMessage id={subtitleLocaleId} />
        </SubTitle>
      )}
    </TitleContainer>
  );
};

export default CommonPageHeader;
