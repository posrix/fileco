import React from 'react';
import { FormattedMessage } from 'react-intl';
import { TitleContainer, Title, SubTitle } from './styled';

export interface CommonPageHeaderProps {
  titleLocaleId: string;
  subTitleLocaleId?: string;
  gutter?: number;
}

const CommonPageHeader: React.FC<CommonPageHeaderProps> = ({
  titleLocaleId,
  subTitleLocaleId,
  gutter,
}) => {
  return (
    <TitleContainer gutter={gutter}>
      <Title>
        <FormattedMessage id={titleLocaleId} />
      </Title>
      {subTitleLocaleId && (
        <SubTitle>
          <FormattedMessage id={subTitleLocaleId} />
        </SubTitle>
      )}
    </TitleContainer>
  );
};

export default CommonPageHeader;
