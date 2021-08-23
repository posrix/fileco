import React, { useState } from 'react';
import Header from 'src/views/Header';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { useIntl, FormattedMessage } from 'react-intl';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { getMnenomicByPassword } from 'src/utils/app';
import Icon from 'src/components/Icon';
import TextField from '@material-ui/core/TextField';
import {
  Container,
  Warning,
  ViewMnemonicContainer,
  ViewMnemonicTitle,
} from './styled';

const ViewMnemonic: React.FC = () => {
  const intl = useIntl();

  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [mnemonic, setMnemonic] = useState('');

  const handleVerify = async () => {
    try {
      const mnemonic = await getMnenomicByPassword(password);
      setMnemonic(mnemonic);
    } catch {
      setIsPasswordError(true);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <CommonPageHeader
          titleLocaleId="setting.view.mnemonic.title"
          subTitleLocaleId="setting.view.mnemonic.subTitle"
          gutter={24}
        />
        <Warning smallGap={!!mnemonic}>
          <Icon glyph="warning" size={15} />
          <FormattedMessage id="setting.view.mnemonic.warning" />
        </Warning>
        {!!mnemonic ? (
          <>
            <ViewMnemonicTitle>
              <FormattedMessage id="setting.view.mnemonic.display.title" />
            </ViewMnemonicTitle>
            <ViewMnemonicContainer>{mnemonic}</ViewMnemonicContainer>
            <CommonPageFooter onlyBack />
          </>
        ) : (
          <>
            <TextField
              type="password"
              fullWidth
              value={password}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setIsPasswordError(false);
                setPassword(event.target.value as string);
              }}
              error={isPasswordError}
              helperText={
                isPasswordError &&
                intl.formatMessage({
                  id: 'unlock.password.validation.incorrect',
                })
              }
              label={intl.formatMessage({
                id: 'unlock.wallet.password',
              })}
            />
            <CommonPageFooter
              onConfirm={handleVerify}
              confirmTextLocaleId="global.view"
            />
          </>
        )}
      </Container>
    </>
  );
};

export default ViewMnemonic;
