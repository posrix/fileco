import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Network } from 'src/types/app';
import { Dispatch, RootState } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';

interface SelectNetworkDropdownProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}

const SelectNetworkDropdown: React.FC<SelectNetworkDropdownProps> = ({
  anchorEl,
  setAnchorEl,
}) => {
  const dispatch = useDispatch<Dispatch>();
  const selectedNetwork = useSelector(
    (state: RootState) => state.app.selectedNetwork
  );

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
          width: '22ch',
        },
      }}
    >
      {Object.keys(Network).map((network) => (
        <MenuItem
          key={network}
          onClick={handleSetNetwork}
          selected={network === selectedNetwork}
          data-value={network}
        >
          {network}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default SelectNetworkDropdown;
