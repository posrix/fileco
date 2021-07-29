import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'src/components/Icon';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import { WrappedLotusRPC, addressEllipsis, getfilUnit } from 'src/utils/app';
import * as moment from 'moment';
import {
  Container,
  OrderListItem,
  OrderListSegment,
  OrderTitle,
  OrderAmount,
  OrderDate,
  OrderFrom,
} from './styled';

interface OrderListProps {
  address: string;
}

const OrderList: React.FC<OrderListProps> = ({ address }) => {
  const history = useHistory();

  async function fetchMessages(): Promise<any[]> {
    const chainHead = await WrappedLotusRPC.client.chainHead();
    const messagesSet = await await Promise.all([
      WrappedLotusRPC.client.stateListMessages(
        {
          From: address,
        },
        [],
        73232
      ),
      WrappedLotusRPC.client.stateListMessages(
        {
          To: address,
        },
        [],
        73232
      ),
    ]);
    const messages = messagesSet[0].concat(messagesSet[1]);
    if (messages) {
      return await Promise.all(
        messages.map(async (cid: any) => {
          const messageFromSearch = await WrappedLotusRPC.client.stateSearchMsg(
            cid
          );
          const messageFromGet = await WrappedLotusRPC.client.chainGetMessage(
            cid
          );
          const tipSet = await WrappedLotusRPC.client.chainGetTipSetByHeight(
            messageFromSearch.Height,
            messageFromSearch.TipSet
          );
          const timestamp = tipSet.Blocks[0].Timestamp;
          return {
            id: messageFromGet['CID']['/'],
            from: messageFromGet['From'],
            to: messageFromGet['To'],
            value: messageFromGet['Value'],
            datetime: moment.unix(timestamp).format('YYYY/MM/DD h:mm:ss'),
          };
        })
      );
    }
  }

  const { data: messages = [] } = useQuery(['orders', address], fetchMessages);

  return (
    <Container>
      {messages.map((message) => (
        <OrderListItem key={message.id}>
          <>
            {message.From === address ? (
              <>
                <Icon glyph="arrow-down-circle" />
                <OrderListSegment>
                  <OrderTitle>接收 / PENDING</OrderTitle>
                  <OrderFrom>从{addressEllipsis(message.from)}</OrderFrom>
                </OrderListSegment>
              </>
            ) : (
              <>
                <Icon glyph="arrow-up-circle" />
                <OrderListSegment>
                  <OrderTitle>发送 / PENDING</OrderTitle>
                  <OrderFrom>到{addressEllipsis(message.to)}</OrderFrom>
                </OrderListSegment>
              </>
            )}
            <OrderListSegment>
              <OrderAmount>{getfilUnit(message.value)}</OrderAmount>
              <OrderDate>{message.datetime}</OrderDate>
            </OrderListSegment>
          </>
        </OrderListItem>
      ))}
    </Container>
  );
};

export default OrderList;
