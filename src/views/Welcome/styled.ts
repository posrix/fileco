import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ContentContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
`;

export const CoverContainer = styled.div`
  height: 320px;
  background: no-repeat center url('home.png');
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  font-family: verdana;
`;

export const Slogan = styled.div`
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  margin-top: 15px;
  font-family: verdana;
`;

export const WalletEntryFlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const WalletEntryContainer = styled.div`
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #bdbdbd;
  margin-bottom: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
`;

export const WalletEntryTitle = styled.div`
  font-weight: 600;
  color: #212121;
  font-size: 16px;
`;

export const WalletEntrySubTitle = styled.div`
  font-weight: 400;
  color: #757575;
  font-size: 12px;
`;
