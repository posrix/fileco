import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'src/components/Icon';
import { useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from 'src/components/Button';
import {
  getLocalStorage,
  WrappedLotusRPC,
  getExtendedKeyBySeed,
  getAddressByNetwork,
  transfer,
  convertFilecoin,
} from 'src/utils/app';
import { Network } from 'src/types/app';
import { Dispatch } from 'src/models/store';
import { RootState } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import OrderList from './OrderList';
import {
  Header,
  NetworkSelector,
  Avatar,
  AccountContainer,
  LotusAccount,
  Account,
  BalanceContainer,
  BalanceDollar,
  TextEllipsis,
  BalanceFilecoin,
  ActionsContainer,
  OrderListTitleContainer,
  OrderListTitle,
} from './styled';

const Home: React.FC = () => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const privateKeyRef = useRef('');
  const dispatch = useDispatch<Dispatch>();
  const selectedNetwork = useSelector(
    (state: RootState) => state.app.selectedNetwork
  );

  useEffect(() => {
    getExtendedKeyBySeed(getLocalStorage('password')).then((extendedKey) => {
      setAddress(getAddressByNetwork(selectedNetwork, extendedKey.address));
      privateKeyRef.current = extendedKey.privateKey;
    });
  }, []);

  useEffect(() => {
    if (selectedNetwork && address) {
      setAddress(getAddressByNetwork(selectedNetwork, address));
      new WrappedLotusRPC(selectedNetwork, true);
      WrappedLotusRPC.client.walletBalance(address).then((value: any) => {
        setBalance(convertFilecoin(value));
      });
    }
  }, [selectedNetwork, address]);

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
    <>
      <Header>
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
      </Header>
      <AccountContainer>
        <LotusAccount>F012689</LotusAccount>
        <Account>{address}</Account>
      </AccountContainer>
      <BalanceContainer>
        <Icon glyph="filecoin" size={32} />
        <BalanceFilecoin>
          <TextEllipsis>{balance}</TextEllipsis>&nbsp;FIL
        </BalanceFilecoin>
        <BalanceDollar>$12345.67 USD</BalanceDollar>
      </BalanceContainer>
      <ActionsContainer>
        <Button variant="contained" fullWidth>
          <FormattedMessage id="global.receive" />
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => {
            transfer({
              client: WrappedLotusRPC.client,
              from: address,
              to: 't1tarmoe3mh6uoznw3sw4322eo4pyvei6o2mbafgi',
              value: 1e18,
              privateKey: privateKeyRef.current,
            });
          }}
        >
          <FormattedMessage id="global.send" />
        </Button>
      </ActionsContainer>
      <OrderListTitleContainer>
        <OrderListTitle>
          <FormattedMessage id="home.order.list" />
        </OrderListTitle>
      </OrderListTitleContainer>
      <OrderList />
    </>
  );
};

export default Home;
