import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const MessageDetail = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const MessageDetailName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #757575;
`;

export const MessageDetailValue = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #212121;
  width: 247px;
  overflow-wrap: break-word;
  text-align: right;
`;
