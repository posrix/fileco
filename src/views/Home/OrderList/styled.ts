import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 245px;
  flex-direction: column;
  overflow: scroll;
`;

export const OrderListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dcdcdc;
  padding: 16px 18px;
  cursor: pointer;
`;

export const OrderListSegment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const OrderTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #212121;
`;

export const OrderAmount = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #212121;
  text-align: right;
`;

export const OrderFrom = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;

export const OrderDate = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;
