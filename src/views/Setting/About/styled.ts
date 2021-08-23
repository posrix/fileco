import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const VersionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #212121;
`;

export const Version = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;

export const VersionSubTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;

export const LinkTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #757575;
`;

export const LinkText = styled.a`
  font-size: 16px;
  font-weight: 600;
  color: #0075ff;
  cursor: pointer;
`;

export const Divider = styled.hr`
  border-top: 1px solid #e0e0e0;
  margin: 17px -21px;
`;
