import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'src/components/Icon';
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import SelectNetworkDropdown from './SelectNetworkDropdown';
import UserDropdown from './UserDropdown';
import Jazzicon from 'react-jazzicon';
import { Container, NetworkSelector, AvatarWrapper } from './styled';

const Header: React.FC = () => {
  const [selectNetworkAnchorEl, setSelectNetworkAnchorEl] =
    useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  const { accountId, selectedNetwork } = useSelector((state: RootState) => {
    const account = state.app.accounts[state.app.selectedAccountId];
    return {
      accountId: account.accountId,
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
      <Icon glyph="logo" size={28} />
      <NetworkSelector onClick={handleNetworkSelectorClick}>
        <FormattedMessage
          id="home.network.current"
          values={{ network: selectedNetwork }}
        />
        <Icon glyph="arrow-down" size={12} />
      </NetworkSelector>
      <AvatarWrapper onClick={handleUserClick}>
        <Jazzicon diameter={28} seed={accountId} />
      </AvatarWrapper>
      <SelectNetworkDropdown
        setAnchorEl={setSelectNetworkAnchorEl}
        anchorEl={selectNetworkAnchorEl}
      />
      <UserDropdown setAnchorEl={setUserAnchorEl} anchorEl={userAnchorEl} />
    </Container>
  );
};

export default Header;
