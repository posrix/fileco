import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'src/components/Icon';
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Button';
import {
  WrappedLotusRPC,
  getAddressByNetwork,
  convertFilecoin,
} from 'src/utils/app';
import { useQuery } from 'react-query';
import Header from 'src/views/Header';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import OrderList from './OrderList';
import {
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
  const [balance, setBalance] = useState(0);
  const dispatch = useDispatch<Dispatch>();
  const { address, selectedNetwork, extendedKey } = useSelector(
    (state: RootState) => state.app
  );

  useQuery(
    ['balance', address],
    () => WrappedLotusRPC.client.walletBalance(address),
    {
      onSuccess: (data) => {
        setBalance(convertFilecoin(data));
      },
      enabled: !!address,
    }
  );

  useEffect(() => {
    if (selectedNetwork) {
      dispatch.app.setAddress(getAddressByNetwork(selectedNetwork, address));
    }
  }, [selectedNetwork]);

  return (
    <>
      <Header />
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
          onClick={() => history.push('/transfer')}
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
