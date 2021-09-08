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
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 40px;
`;

export const ForgotPasswordContainer = styled.div`
  margin-top: 7px;
  font-size: 12px;
  display: flex;
`;

export const ForgotPasswordPartText = styled.div`
  color: #757575;
`;

export const ForgotPasswordLinkText = styled.div`
  color: #0060ff;
  cursor: pointer;
`;
