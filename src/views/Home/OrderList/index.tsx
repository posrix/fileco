import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'src/components/Icon';
import { useHistory } from 'react-router-dom';
import {
  WrappedLotusRPC,
} from 'src/utils/app';
import {
  Container,
  OrderListItem,
  OrderListSegment,
  OrderTitle,
  OrderAmount,
  OrderDate,
  OrderFrom,
} from './styled';

const Home: React.FC = () => {
  const history = useHistory();

  // async function stateListMessages() {
  //   const listMessages = await WrappedLotusRPC.client.stateListMessages(
  //     {
  //       From: '',
  //       To: '',
  //     },
  //     [],
  //     0
  //   );
  //   if (!listMessages) return;
  //   const chainMessages = await Promise.all(
  //     listMessages.map(async (cid: any) => {
  //       return await WrappedLotusRPC.client.chainGetMessage(cid);
  //     })
  //   );
  // }

  return (
    <Container>
      <OrderListItem>
        <Icon glyph="arrow-down-circle" />
        <OrderListSegment>
          <OrderTitle>接收 / PENDING</OrderTitle>
          <OrderFrom>从f17ead...349a</OrderFrom>
        </OrderListSegment>
        <OrderListSegment>
          <OrderAmount>2.99 FIL</OrderAmount>
          <OrderDate>2021-05-26 17:37:10</OrderDate>
        </OrderListSegment>
      </OrderListItem>
    </Container>
  );
};

export default Home;
