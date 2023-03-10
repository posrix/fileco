import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Button';
import {
  getAddressByNetwork,
  convertToFilUnit,
  addressEllipsis,
} from 'src/utils/app';
import { useQuery } from 'react-query';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import MessageList from './MessageList';
import Icon from 'src/components/Icon';
import Alert from 'src/components/Alert';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Container,
  AccountContainer,
  AccountSelectionContainer,
  LotusAccount,
  Account,
  BalanceContainer,
  BalanceDollar,
  TextEllipsis,
  BalanceFilecoin,
  ActionsContainer,
  MessageListTitleContainer,
  MessageListTitle,
  MessageListContainer,
  ButtonSpinner,
} from './styled';

const Home: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch<Dispatch>();
  const {
    address,
    idAddress,
    selectedNetwork,
    balance,
    balanceUSD,
    accountId,
    accounts,
  } = useSelector((state: RootState) => {
    const account = state.app.accounts[state.app.selectedAccountId];
    const selectedNetwork = state.app.selectedNetwork;
    return {
      accounts: state.app.accounts,
      idAddress: account.idAddresses[selectedNetwork],
      address: account.address,
      balance: account.balances[selectedNetwork],
      balanceUSD: account.balancesUSD[selectedNetwork],
      accountId: account.accountId,
      selectedNetwork,
    };
  });

  useQuery(
    ['balance', address, selectedNetwork],
    () =>
      dispatch.app.fetchBalance({
        network: selectedNetwork,
        address,
        accountId,
      }),
    {
      enabled: !!address && !!selectedNetwork,
    }
  );

  useQuery(
    ['idAddress', address, selectedNetwork],
    () =>
      dispatch.app.fetchIdAddress({
        network: selectedNetwork,
        address,
        accountId,
      }),
    {
      enabled: !!address && !!selectedNetwork,
    }
  );

  useQuery(
    ['price', address, selectedNetwork, balance],
    () =>
      dispatch.app.fetchBalanceUSD({
        network: selectedNetwork,
        accountId,
      }),
    {
      enabled: !!balance,
    }
  );

  useEffect(() => {
    if (selectedNetwork) {
      accounts.forEach((account) =>
        dispatch.app.setAddress({
          accountId: account.accountId,
          address: getAddressByNetwork(selectedNetwork, account.address),
        })
      );
    }
  }, [selectedNetwork]);

  const { isLoading } = useQuery(
    ['messages', address, selectedNetwork],
    () => dispatch.app.fetchMessages({ firstTime: true, accountId }),
    {
      enabled: !!address && !!selectedNetwork,
    }
  );

  return (
    <Container>
      <AccountContainer>
        <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
          <AccountSelectionContainer>
            <LotusAccount>{idAddress || '-'}</LotusAccount>
            <Account>{addressEllipsis(address)}</Account>
          </AccountSelectionContainer>
        </CopyToClipboard>
      </AccountContainer>
      <BalanceContainer>
        <Icon glyph="filecoin" size={32} />
        <BalanceFilecoin>
          <TextEllipsis>{convertToFilUnit(balance)}</TextEllipsis>
        </BalanceFilecoin>
        <BalanceDollar>${balanceUSD} USD</BalanceDollar>
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
          <FormattedMessage id="home.message.list" />
          {isLoading && <ButtonSpinner glyph="spinner" />}
        </MessageListTitle>
      </MessageListTitleContainer>
      <MessageListContainer>
        <MessageList />
      </MessageListContainer>
      <Alert
        open={copied}
        setOpen={setCopied}
        textLocalId="global.copied"
      />
    </Container>
  );
};

export default Home;
