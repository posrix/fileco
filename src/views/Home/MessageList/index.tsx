import React from 'react';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { addressEllipsis, getFilByUnit } from 'src/utils/app';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  MessageListItem,
  MessageListSegment,
  Title,
  OrderAmount,
  OrderDate,
  OrderFrom,
  ButtonSpinner,
} from './styled';

interface MessageListProps {
  address: string;
}

const MessageList: React.FC<MessageListProps> = ({ address }) => {
  const history = useHistory();

  const { messages } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<Dispatch>();

  const { isLoading } = useQuery('messages', () =>
    dispatch.app.fetchMessages(address)
  );

  return (
    <Container>
      {isLoading && (
        <MessageListItem>
          <ButtonSpinner glyph="spinner" />
        </MessageListItem>
      )}
      {messages.map((message) => (
        <MessageListItem key={message.cid['/']}>
          <>
            {message.from === address ? (
              <>
                <Icon glyph="arrow-down-circle" />
                <MessageListSegment>
                  <Title>
                    <FormattedMessage id="home.message.list.send" />
                    {message.pending && ' / PENDING'}
                  </Title>
                  <OrderFrom>
                    <FormattedMessage id="home.message.list.to" />
                    {addressEllipsis(message.to)}
                  </OrderFrom>
                </MessageListSegment>
              </>
            ) : (
              <>
                <Icon glyph="arrow-up-circle" />
                <MessageListSegment>
                  <Title>
                    <FormattedMessage id="home.message.list.receive" />
                    {message.pending && ' / PENDING'}
                  </Title>
                  <OrderFrom>
                    <FormattedMessage id="home.message.list.from" />
                    {addressEllipsis(message.from)}
                  </OrderFrom>
                </MessageListSegment>
              </>
            )}
            <MessageListSegment>
              <OrderAmount>{getFilByUnit(message.value)}</OrderAmount>
              <OrderDate>{message.datetime}</OrderDate>
            </MessageListSegment>
          </>
        </MessageListItem>
      ))}
    </Container>
  );
};

export default MessageList;
