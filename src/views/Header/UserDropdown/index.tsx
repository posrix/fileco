import React from 'react';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import { Dispatch, RootState } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Divider } from '@material-ui/core';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import {
  convertToFilUnit,
  addressEllipsis,
  getPersistenceMemory,
  setPersistenceMemory,
} from 'src/utils/app';
import Jazzicon from 'react-jazzicon';
import {
  AccountContainer,
  AccountTitle,
  AccountSelectContainer,
  AccountSelectWrapper,
  MenuName,
  Address,
  Balance,
  ExternalAccountLabel,
  AddressContainer,
  DividerWrapper,
  LockContainer,
  LockButton,
} from './styled';

interface UserDropdownProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  anchorEl,
  setAnchorEl,
}) => {
  const dispatch = useDispatch<Dispatch>();
  const history = useHistory();
  const { accounts, selectedAccountId, selectedNetwork } = useSelector(
    (state: RootState) => ({
      accounts: state.app.accounts,
      selectedAccountId: state.app.selectedAccountId,
      selectedNetwork: state.app.selectedNetwork,
    })
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const routeTo = (route: string) => {
    history.push(route);
    handleClose();
  };

  const createAccount = () => {
    getPersistenceMemory({
      event: 'GET_PASSWORD',
      key: 'password',
    }).then((password) => {
      dispatch.app.createAccountOrGetExtendedKey({
        password,
      });
    });
  };

  const lockAccount = () => {
    setPersistenceMemory({
      event: 'SET_PASSWORD',
      entity: { password: '' },
    });
    routeTo('/unlock');
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        style: {
          width: '280px',
          padding: '15px 0',
          maxHeight: 517,
        },
      }}
    >
      <AccountContainer>
        <AccountTitle>
          <FormattedMessage id="user.dropdown.account.my" />
        </AccountTitle>
        <AccountSelectWrapper>
          {accounts.map((account) => (
            <AccountSelectContainer
              key={account.accountId}
              onClick={() => {
                dispatch.app.setSelectedAccountId(account.accountId);
              }}
            >
              <Icon
                glyph="check"
                size={24}
                hide={!(selectedAccountId === account.accountId)}
              />
              <Jazzicon diameter={28} seed={account.accountId} />
              <AddressContainer>
                <Address>{addressEllipsis(account.address)}</Address>
                <Balance>
                  {convertToFilUnit(account.balances[selectedNetwork])}
                </Balance>
              </AddressContainer>
              {account.isExternal && (
                <ExternalAccountLabel>
                  <FormattedMessage id="user.dropdown.account.imported" />
                </ExternalAccountLabel>
              )}
            </AccountSelectContainer>
          ))}
        </AccountSelectWrapper>
      </AccountContainer>
      <DividerWrapper>
        <Divider />
      </DividerWrapper>
      <MenuItem onClick={createAccount}>
        <Icon glyph="add" size={24} />
        <MenuName>
          <FormattedMessage id="user.dropdown.account.add" />
        </MenuName>
      </MenuItem>
      <MenuItem onClick={() => routeTo('/import-account')}>
        <Icon glyph="download" size={24} />
        <MenuName>
          <FormattedMessage id="user.dropdown.account.import" />
        </MenuName>
      </MenuItem>
      <DividerWrapper>
        <Divider />
      </DividerWrapper>
      <MenuItem onClick={() => routeTo('/setting')}>
        <Icon glyph="setting" size={24} />
        <MenuName>
          <FormattedMessage id="user.dropdown.setting" />
        </MenuName>
      </MenuItem>
      <LockContainer>
        <LockButton variant="contained" onClick={lockAccount}>
          <FormattedMessage id="user.dropdown.lock" />
        </LockButton>
      </LockContainer>
    </Popover>
  );
};

export default UserDropdown;
