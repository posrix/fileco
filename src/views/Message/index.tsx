import React from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getFilByUnit } from 'src/utils/app';
import { useHistory } from 'react-router';
import Header from 'src/views/Header';
import CommonPageHeader from 'src/components/CommonPageHeader';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import {
  Container,
  MessageDetail,
  MessageDetailName,
  MessageDetailValue,
} from './styled';

interface ParamTypes {
  cid: string;
}

const Message: React.FC = () => {
  const history = useHistory();
  const { cid } = useParams<ParamTypes>();

  const selectedMessage = useSelector(
    (state: RootState) =>
      state.app.accounts[state.app.selectedAccountId].messages[
        state.app.selectedNetwork
      ].combinedMessages.filter((message) => message.cid['/'] === cid)[0]
  );

  if (!selectedMessage) {
    history.goBack();
    return null;
  }

  return (
    <>
      <Header />
      <Container>
        <CommonPageHeader titleLocaleId="transfer.detail.title" gutter={30} />
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.cid" />
          </MessageDetailName>
          <MessageDetailValue>{selectedMessage.cid['/']}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.height" />
          </MessageDetailName>
          <MessageDetailValue>{selectedMessage.height}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.time" />
          </MessageDetailName>
          <MessageDetailValue>{selectedMessage.datetime}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.sender" />
          </MessageDetailName>
          <MessageDetailValue>{selectedMessage.from}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.receiver" />
          </MessageDetailName>
          <MessageDetailValue>{selectedMessage.to}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.amount" />
          </MessageDetailName>
          <MessageDetailValue>
            {getFilByUnit(selectedMessage.value)}
          </MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>
            <FormattedMessage id="transfer.detail.status" />
          </MessageDetailName>
          <MessageDetailValue>{selectedMessage.status}</MessageDetailValue>
        </MessageDetail>
        <CommonPageFooter onlyBack />
      </Container>
    </>
  );
};

export default Message;
