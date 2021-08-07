import React from 'react';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import { Dispatch, RootState } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Divider } from '@material-ui/core';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import { getFilByUnit, addressEllipsis } from 'src/utils/app';
import {
  AccountContainer,
  AccountTitle,
  AccountSelectContainer,
  MenuName,
  Avatar,
  Address,
  Balance,
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

  const { address, balance } = useSelector((state: RootState) => state.app);

  const handleClose = () => {
    setAnchorEl(null);
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
          width: '224px',
          padding: '15px 0',
        },
      }}
    >
      <AccountContainer>
        <AccountTitle>
          <FormattedMessage id="user.dropdown.account.my" />
        </AccountTitle>
        <AccountSelectContainer>
          <Icon glyph="check" size={24} />
          <Avatar />
          <AddressContainer>
            <Address>{addressEllipsis(address)}</Address>
            <Balance>{getFilByUnit(balance)}</Balance>
          </AddressContainer>
        </AccountSelectContainer>
        <AccountSelectContainer></AccountSelectContainer>
      </AccountContainer>
      <DividerWrapper>
        <Divider />
      </DividerWrapper>
      <MenuItem>
        <Icon glyph="add" size={24} />
        <MenuName>
          <FormattedMessage id="user.dropdown.account.add" />
        </MenuName>
      </MenuItem>
      <MenuItem>
        <Icon glyph="download" size={24} />
        <MenuName>
          <FormattedMessage id="user.dropdown.account.import" />
        </MenuName>
      </MenuItem>
      <DividerWrapper>
        <Divider />
      </DividerWrapper>
      <MenuItem onClick={() => history.push('/setting')}>
        <Icon glyph="setting" size={24} />
        <MenuName>
          <FormattedMessage id="user.dropdown.setting" />
        </MenuName>
      </MenuItem>
      <LockContainer>
        <LockButton variant="contained">
          <FormattedMessage id="user.dropdown.lock" />
        </LockButton>
      </LockContainer>
    </Popover>
  );
};

export default UserDropdown;
