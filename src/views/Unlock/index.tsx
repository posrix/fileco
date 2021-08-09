import React, { useState } from 'react';
import { Dispatch } from 'src/models/store';
import { RootState } from 'src/models/store';
import { WrappedLotusRPC } from 'src/utils/app';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from 'src/components/Button';
import { getExtendedKeyBySeed, getAddressByNetwork } from 'src/utils/app';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Container,
  CoverContainer,
  Title,
  Slogan,
  UnlockContainer,
} from './styled';

interface UnlockProps {
  location: any;
}
const Unlock: React.FC<UnlockProps> = ({ location }) => {
  const history = useHistory();
  const intl = useIntl();
  const selectedNetwork = useSelector(
    (state: RootState) => state.app.selectedNetwork
  );
  const dispatch = useDispatch<Dispatch>();
  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);

  const handleUnlock = () => {
    getExtendedKeyBySeed(password)
      .then((extendedKey) => {
        dispatch.app.setAddress(
          getAddressByNetwork(selectedNetwork, extendedKey.address)
        );
        dispatch.app.setExtendedKey(extendedKey);
        new WrappedLotusRPC(selectedNetwork, true);
        history.replace(
          location.state && location.state.from
            ? location.state.from.pathname
            : 'home'
        );
      })
      .catch(() => {
        setIsPasswordError(true);
      });
  };

  return (
    <Container>
      <CoverContainer>
        <div>
          <Title>Keystore</Title>
          <Title>Lite</Title>
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
      </UnlockContainer>
    </Container>
  );
};

export default Unlock;
