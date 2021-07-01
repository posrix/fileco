import styled from 'styled-components';

const PADDING = 20;
const COVER_HEIGHT = 320;

export const Container = styled.div`
  padding: ${PADDING}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: ${600 - COVER_HEIGHT - PADDING}px;
`;

export const CoverContainer = styled.div`
  width: 360px;
  height: ${COVER_HEIGHT}px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: #fff;
`;

export const Slogan = styled.div`
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  margin-top: 15px;
`;

export const WalletEntryContainer = styled.div`
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #bdbdbd;
  margin-bottom: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
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
