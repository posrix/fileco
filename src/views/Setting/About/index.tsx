import React from 'react';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { FormattedMessage } from 'react-intl';
import CommonPageFooter from 'src/components/CommonPageFooter';
import {
  Container,
  ColumnContainer,
  VersionTitle,
  Version,
  VersionSubTitle,
  LinkTitle,
  LinkText,
  Divider,
} from './styled';

const About: React.FC = () => {
  return (
    <Container>
      <CommonPageHeader titleLocaleId="setting.menu.about.title" gutter={38} />
      <ColumnContainer>
        <VersionTitle>
          <FormattedMessage id="setting.about.version.title" />
        </VersionTitle>
        <Version>1.0.0</Version>
        <VersionSubTitle>
          <FormattedMessage id="setting.about.version.subTitle" />
        </VersionSubTitle>
        <Divider />
        <LinkTitle>
          <FormattedMessage id="setting.about.link.title" />
        </LinkTitle>
        <LinkText>
          <FormattedMessage id="setting.about.link.privacy" />
        </LinkText>
        <LinkText>
          <FormattedMessage id="setting.about.link.term" />
        </LinkText>
        <LinkText>
          <FormattedMessage id="setting.about.link.website" />
        </LinkText>
      </ColumnContainer>
      <CommonPageFooter onlyBack />
    </Container>
  );
};

export default About;
