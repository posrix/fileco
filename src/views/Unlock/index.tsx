import React, { useEffect, useState } from 'react';
import { RootState, Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from 'src/components/Button';
import { getLocalStorage, setPersistenceMemory } from 'src/utils/app';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';
import { IS_PRODUCTION, DEV_PASSWORD } from 'src/utils/constants';
import {
  Container,
  CoverContainer,
  Title,
  Slogan,
  UnlockContainer,
  ForgotPasswordContainer,
  ForgotPasswordLinkText,
  ForgotPasswordPartText,
} from './styled';

interface UnlockProps {
  location: any;
}
const Unlock: React.FC<UnlockProps> = ({ location }) => {
  const [password, setPassword] = useState(IS_PRODUCTION ? '' : DEV_PASSWORD);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const history = useHistory();
  const intl = useIntl();
  const dispatch = useDispatch<Dispatch>();
  const selectedAccountId = useSelector(
    (state: RootState) => state.app.selectedAccountId
  );

  useEffect(() => {
    if (!getLocalStorage('mnemonic')) {
      history.replace('/');
    }
  }, []);

  const handleUnlock = async () => {
    try {
      await dispatch.app.createAccountOrGetExtendedKey({
        password,
        accountId: selectedAccountId,
      });
      setPersistenceMemory({
        event: 'SET_PASSWORD',
        entity: { password },
      });
      dispatch.app.setPasswordFreshTime(moment());
      history.replace(
        location.state && location.state.from
          ? location.state.from.pathname
          : 'home'
      );
    } catch {
      setIsPasswordError(true);
    }
  };

  const routeToImportWallet = () => {
    history.push({
      pathname: 'import-wallet',
      state: { forgotPassword: true },
    });
  };

  return (
    <Container>
      <CoverContainer>
        <div>
          <Title>Fileco</Title>
          <Slogan>
            <FormattedMessage id="unlock.welcome.back.slogan" />
          </Slogan>
        </div>
      </CoverContainer>
      <UnlockContainer>
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
        <Button
          type="button"
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleUnlock}
        >
          <FormattedMessage id="unlock.button" />
        </Button>
        <ForgotPasswordContainer>
          <ForgotPasswordPartText>
            <FormattedMessage id="unlock.forgotPassword.text" />
          </ForgotPasswordPartText>
          <span>&nbsp;</span>
          <ForgotPasswordLinkText onClick={routeToImportWallet}>
            <FormattedMessage id="unlock.forgotPassword.link" />
          </ForgotPasswordLinkText>
        </ForgotPasswordContainer>
      </UnlockContainer>
    </Container>
  );
};

export default Unlock;
