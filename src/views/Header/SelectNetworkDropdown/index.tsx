import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Network } from 'src/types/app';
import { Dispatch } from 'src/models/store';
import { useDispatch } from 'react-redux';

interface SelectNetworkDropdownProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}

const SelectNetworkDropdown: React.FC<SelectNetworkDropdownProps> = ({
  anchorEl,
  setAnchorEl,
}) => {
  const dispatch = useDispatch<Dispatch>();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetNetwork = (event: React.MouseEvent<HTMLElement>) => {
    dispatch.app.setSelectedNetwork(
      event.currentTarget.dataset.value as Network
    );
    handleClose();
  };

  return (
    <Menu
      id="select-network-menu"
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
  );
};

export default SelectNetworkDropdown;
