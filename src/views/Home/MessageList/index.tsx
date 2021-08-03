import React from 'react';
import Icon from 'src/components/Icon';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { addressEllipsis, getFilByUnit } from 'src/utils/app';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {
  MessageListItem,
  MessageListSegment,
  Title,
  OrderAmount,
  OrderDate,
  OrderFrom,
} from './styled';

interface MessageListProps {
  address: string;
  handleLoading: (state: boolean) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  address,
  handleLoading,
}) => {
  const history = useHistory();

  const { messages } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch<Dispatch>();

  const { isLoading } = useQuery('messages', () =>
    dispatch.app.fetchMessages(address)
  );

  if (isLoading) {
    handleLoading(true);
  }

  return (
    <AutoSizer>
      {({ width }) => (
        <List
          height={288}
          width={width}
          rowCount={messages.length}
          rowHeight={74}
          rowRenderer={({ index, key, style }) => {
            const message = messages[index];
            return (
              <MessageListItem key={key} style={style}>
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
            );
          }}
        />
      )}
    </AutoSizer>
  );
};

export default MessageList;
