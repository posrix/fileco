import styled from 'styled-components';

export const Header = styled.div`
  background-color: #e0e0e0;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
`;

export const NetworkSelector = styled.div`
  border-radius: 6px;
  border: 1px solid #bdbdbd;
  color: #757575;
  display: flex;
  font-weight: 600;
  gap: 7px;
  padding: 6px 8px;
  cursor: pointer;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 28px;
  height: 28px;
  background: #0075ff;
  border-radius: 12px;
`;

export const AccountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0px 1px 0px 0px #e0e0e0;
`;

export const Account = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;

export const LotusAccount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #212121;
`;

export const BalanceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 32px;
`;

export const BalanceFilecoin = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #212121;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const TextEllipsis = styled.div`
  display: inline-block;
  width: 40%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const BalanceDollar = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #757575;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 52px;
`;

export const OrderListTitleContainer = styled.div`
  padding: 8px 16px;
  box-shadow: 0 4px 4px -2px rgba(33, 33, 33, 0.16);
`;

export const OrderListTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #757575;
`;
