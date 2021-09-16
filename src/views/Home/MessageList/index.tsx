import React from 'react';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { addressEllipsis, convertToFilUnit } from 'src/utils/app';
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import { MessageStatus } from 'src/types/app';
import List from 'react-virtualized/dist/commonjs/List';
import {
  MessageListItem,
  MessageListSegment,
  Title,
  OrderAmount,
  OrderDate,
  OrderFrom,
} from './styled';

const MessageList: React.FC = () => {
  const history = useHistory();

  const { messages, address } = useSelector((state: RootState) => {
    const account = state.app.accounts[state.app.selectedAccountId];
    return {
      messages: account.messages[state.app.selectedNetwork].combinedMessages,
      address: state.app.selectedNetwork,
    };
  });

  return (
    <List
      height={225}
      width={357}
      rowCount={messages.length}
      rowHeight={74}
      rowRenderer={({ index, key, style }) => {
        const message = messages[index];
        return (
          <MessageListItem
            key={key}
            style={style}
            onClick={() => history.push(`message/${message.cid['/']}`)}
          >
            <>
              {message.from === address ? (
                <>
                  <Icon glyph="arrow-down-circle" />
                  <MessageListSegment>
                    <Title>
                      <FormattedMessage id="home.message.list.send" />
                      {message.status !== MessageStatus.SUCCESS &&
                        ` / ${message.status}`}
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
                      {message.status !== MessageStatus.SUCCESS &&
                        ` / ${message.status}`}
                    </Title>
                    <OrderFrom>
                      <FormattedMessage id="home.message.list.from" />
                      {addressEllipsis(message.from)}
                    </OrderFrom>
                  </MessageListSegment>
                </>
              )}
              <MessageListSegment>
                <OrderAmount>
                  {convertToFilUnit(message.value)}
                </OrderAmount>
                <OrderDate>{message.datetime}</OrderDate>
              </MessageListSegment>
            </>
          </MessageListItem>
        );
      }}
    />
  );
};

export default MessageList;
