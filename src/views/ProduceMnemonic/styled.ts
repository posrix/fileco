import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const Mnemonic = styled.div`
  border: 1px solid #f7f7f7;
  border-radius: 4px;
  padding: 20px;
  font-size: 18px;
  text-align: center;
  margin-top: 24px;
`;

export const MnemonicLockedPlaceholder = styled.div`
  background-color: #5b5b5b;
  border-radius: 4px;
  min-height: 167px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  margin-top: 24px;
`;

export const Warning = styled.div`
  font-size: 12px;
  color: #f34447;
`;

export const WarningContainer = styled.div`
  margin-top: 24px;
`;
