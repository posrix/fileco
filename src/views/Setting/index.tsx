import React from 'react';
import { FormattedMessage } from 'react-intl';
import Header from 'src/views/Header';
import CommonPageHeader from 'src/components/CommonPageHeader';
import CommonPageFooter from 'src/components/CommonPageFooter';
import Icon from 'src/components/Icon';
import { Divider } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Language } from 'src/types/app';
import { getLocalStorage, setLocalStorage } from 'src/utils/app';
import {
  Container,
  SegmentContainer,
  SegmentTitleContainer,
  SegmentSubTitle,
  SegmentTitle,
  DividerWrapper,
  LanguageSelectContainer,
} from './styled';

const Setting: React.FC = () => {
  const locale = getLocalStorage('locale') || Language.zh;
  return (
    <>
      <Header />
      <Container>
        <CommonPageHeader titleLocaleId="global.setting" gutter={20} />
        <SegmentContainer>
          <SegmentTitleContainer>
            <SegmentTitle>
              <FormattedMessage id="setting.mnemonic.view.title" />
            </SegmentTitle>
            <SegmentSubTitle>
              <FormattedMessage id="setting.mnemonic.view.subTitle" />
            </SegmentSubTitle>
          </SegmentTitleContainer>
          <Icon glyph="arrow-right" />
        </SegmentContainer>

        <DividerWrapper>
          <Divider />
        </DividerWrapper>

        <SegmentContainer>
          <SegmentTitleContainer>
            <SegmentTitle>
              <FormattedMessage id="setting.language.title" />
            </SegmentTitle>
            <SegmentSubTitle>
              <FormattedMessage id="setting.language.zh" />
            </SegmentSubTitle>
          </SegmentTitleContainer>
          <Icon glyph="arrow-right" />
        </SegmentContainer>
        <LanguageSelectContainer>
          <FormControl variant="outlined" size="small">
            <Select
              value={locale}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setLocalStorage('locale', event.target.value as Language);
                history.go(0);
              }}
            >
              <MenuItem value={Language.zh}>
                <FormattedMessage id="setting.language.zh" />
              </MenuItem>
              <MenuItem value={Language.en}>
                <FormattedMessage id="setting.language.en" />
              </MenuItem>
            </Select>
          </FormControl>
        </LanguageSelectContainer>
        <DividerWrapper>
          <Divider />
        </DividerWrapper>

        <SegmentContainer>
          <SegmentTitleContainer>
            <SegmentTitle>
              <FormattedMessage id="setting.about.title" />
            </SegmentTitle>
            <SegmentSubTitle>
              <FormattedMessage id="setting.about.subTitle" />
            </SegmentSubTitle>
          </SegmentTitleContainer>
          <Icon glyph="arrow-right" />
        </SegmentContainer>
        <CommonPageFooter onlyBack />
      </Container>
    </>
  );
};

export default Setting;