import styled from 'styled-components';
import Button from 'src/components/Button';

export const AccountContainer = styled.div`
  padding: 0 15px;
`;

export const AccountTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #757575;
  margin-bottom: 20px;
`;

export const AccountSelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const MenuName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #212121;
  margin-left: 12px;
`;

export const Avatar = styled.div`
  width: 28px;
  height: 28px;
  background: #0075ff;
  border-radius: 12px;
  cursor: pointer;
`;

export const Address = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #212121;
`;

export const Balance = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;

export const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DividerWrapper = styled.div`
  margin: 12px 0;
`;

export const LockContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

export const LockButton = styled(Button)`
  padding: 3px 16px;
  font-size: 12px;
  color: #757575;
`;