import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Warning = styled.div<{ smallGap?: boolean }>`
  display: flex;
  gap: 13px;
  background: #ffeaed;
  border-radius: 4px;
  padding: 14px;
  color: #f34447;
  font-size: 12px;
  margin-bottom: ${(props) => (!props.smallGap ? '65px' : '24px')};
`;

export const ViewMnemonicContainer = styled.div`
  border-radius: 4px;
  border: 1px solid #bdbdbd;
  font-size: 14px;
  padding: 12px;
  color: #212121;
`;

export const ViewMnemonicTitle = styled.div`
  color: #757575;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
`;
