import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'src/components/Icon';
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import SelectNetworkDropdown from './SelectNetworkDropdown';
import UserDropdown from './UserDropdown';
import { Container, NetworkSelector } from './styled';

const Header: React.FC = () => {
  const [selectNetworkAnchorEl, setSelectNetworkAnchorEl] =
    useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  const { address, selectedNetwork } = useSelector((state: RootState) => {
    const account = state.app.accounts[state.app.selectedAccountId];
    return {
      address: account.address,
      selectedNetwork: state.app.selectedNetwork,
    };
  });

  const handleNetworkSelectorClick = (event: React.MouseEvent<HTMLElement>) => {
    setSelectNetworkAnchorEl(event.currentTarget);
  };

  const handleUserClick = (event: React.SyntheticEvent<any, Event>) => {
    setUserAnchorEl(event.currentTarget);
  };

  return (
    <Container>
      <Icon glyph="keystore" />
      <NetworkSelector onClick={handleNetworkSelectorClick}>
        <FormattedMessage
          id="home.network.current"
          values={{ network: selectedNetwork }}
        />
        <Icon glyph="arrow-down" size={12} />
      </NetworkSelector>
      <Avatar
        name={address}
        round
        size="28"
        style={{ cursor: 'pointer' }}
        onClick={handleUserClick}
      />
      <SelectNetworkDropdown
        setAnchorEl={setSelectNetworkAnchorEl}
        anchorEl={selectNetworkAnchorEl}
      />
      <UserDropdown setAnchorEl={setUserAnchorEl} anchorEl={userAnchorEl} />
    </Container>
  );
};

export default Header;
