import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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

export const UnlockContainer = styled.div`
  padding: 65px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
