import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from 'src/components/Icon';
import { Network } from 'src/types/app';
import { Dispatch } from 'src/models/store';
import { RootState } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { Container, NetworkSelector, Avatar } from './styled';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch<Dispatch>();
  const selectedNetwork = useSelector(
    (state: RootState) => state.app.selectedNetwork
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetNetwork = (event: any) => {
    dispatch.app.setSelectedNetwork(event.currentTarget.dataset.value);
    handleClose();
  };

  return (
    <Container>
      <Icon glyph="keystore" />
      <NetworkSelector
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FormattedMessage
          id="home.network.current"
          values={{ network: selectedNetwork }}
        />
        <Icon glyph="arrow-down" size={12} />
      </NetworkSelector>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={handleSetNetwork} data-value={Network.Calibration}>
          {Network.Calibration}
        </MenuItem>
        <MenuItem onClick={handleSetNetwork} data-value={Network.Mainnet}>
          {Network.Mainnet}
        </MenuItem>
      </Menu>
      <Avatar></Avatar>
    </Container>
  );
};

export default Header;
