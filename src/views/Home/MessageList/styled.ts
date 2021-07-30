import styled from 'styled-components';
import Icon from 'src/components/Icon';

export const Container = styled.div`
  display: flex;
  height: 245px;
  flex-direction: column;
  overflow: scroll;
`;

export const MessageListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dcdcdc;
  padding: 16px 18px;
  cursor: pointer;
`;

export const MessageListSegment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.div`
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

export const ButtonSpinner = styled(Icon)`
  width: 13px;
  height: 13px;
  margin-left: 7px;
  animation: rotate 1000ms linear infinite;
  transform-origin: center center;

  @keyframes rotate {
    0% {
      -webkit-transform: rotate(130deg);
      transform: rotate(0) translateZ(0);
    }
    100% {
      -webkit-transform: rotate(360deg) translateZ(0);
      transform: rotate(360deg) translateZ(0);
    }
  }
`;
