import React from 'react';
import { useParams } from 'react-router-dom';
import { getFilByUnit } from 'src/utils/app';
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
  const { cid } = useParams<ParamTypes>();
  const selected = useSelector(
    (state: RootState) =>
      state.app.messages.filter((message) => message.cid['/'] === cid)[0]
  );

  if (!selected) {
    return null;
  }

  return (
    <>
      <Header />
      <Container>
        <CommonPageHeader titleLocaleId="transfer.detail.title" gutter={50} />
        <MessageDetail>
          <MessageDetailName>交易ID</MessageDetailName>
          <MessageDetailValue>{selected.cid['/']}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>高度</MessageDetailName>
          <MessageDetailValue>{selected.height}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>时间</MessageDetailName>
          <MessageDetailValue>{selected.datetime}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>发送方</MessageDetailName>
          <MessageDetailValue>{selected.from}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>接收方</MessageDetailName>
          <MessageDetailValue>{selected.to}</MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>数量</MessageDetailName>
          <MessageDetailValue>
            {getFilByUnit(selected.value)}
          </MessageDetailValue>
        </MessageDetail>
        <MessageDetail>
          <MessageDetailName>状态</MessageDetailName>
          <MessageDetailValue>
            {selected.pending ? 'PENDING' : 'COMPLETE'}
          </MessageDetailValue>
        </MessageDetail>
        <CommonPageFooter onlyBack />
      </Container>
    </>
  );
};

export default Message;
