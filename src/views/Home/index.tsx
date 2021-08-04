import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Button';
import {
  WrappedLotusRPC,
  getAddressByNetwork,
  getFilByUnit,
  addressEllipsis,
} from 'src/utils/app';
import { useQuery } from 'react-query';
import Header from 'src/views/Header';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import MessageList from './MessageList';
import Icon from 'src/components/Icon';
import {
  AccountContainer,
  LotusAccount,
  Account,
  BalanceContainer,
  BalanceDollar,
  TextEllipsis,
  BalanceFilecoin,
  ActionsContainer,
  MessageListTitleContainer,
  MessageListTitle,
  ButtonSpinner,
} from './styled';

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch<Dispatch>();
  const { address, selectedNetwork } = useSelector(
    (state: RootState) => state.app
  );

  const { data: balance = 0 } = useQuery(
    ['balance', address],
    () => WrappedLotusRPC.client.walletBalance(address),
    {
      enabled: !!address,
    }
  );

  useEffect(() => {
    if (selectedNetwork) {
      dispatch.app.setAddress(getAddressByNetwork(selectedNetwork, address));
    }
  }, [selectedNetwork]);

  const { isLoading } = useQuery('messages', () =>
    dispatch.app.fetchMessages(address)
  );

  return (
    <>
      <Header />
      <AccountContainer>
        <LotusAccount>F012689</LotusAccount>
        <Account>{addressEllipsis(address)}</Account>
      </AccountContainer>
      <BalanceContainer>
        <Icon glyph="filecoin" size={32} />
        <BalanceFilecoin>
          <TextEllipsis>{getFilByUnit(balance)}</TextEllipsis>
        </BalanceFilecoin>
        <BalanceDollar>$12345.67 USD</BalanceDollar>
      </BalanceContainer>
      <ActionsContainer>
        <Button
          variant="contained"
          fullWidth
          onClick={() => history.push('/receive')}
        >
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
      <MessageListTitleContainer>
        <MessageListTitle>
          <FormattedMessage id="home.message.list.title" />
          {isLoading && <ButtonSpinner glyph="spinner" />}
        </MessageListTitle>
      </MessageListTitleContainer>
      <MessageList address={address} />
    </>
  );
};

export default Home;
