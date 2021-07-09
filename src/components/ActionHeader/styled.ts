import styled from 'styled-components';
import { ActionHeaderProps } from './';

export const Title = styled.div`
  margin-top: 60px;
  font-weight: 600;
  font-size: 24px;
  color: #212121;
`;

export const SubTitle = styled.div`
  font-size: 14px;
  color: #212121;
  margin-top: 8px;
`;

export const TitleContainer = styled.div<Pick<ActionHeaderProps, 'gutter'>>`
  margin-bottom: ${(props) => (!props.gutter ? '20px' : `${props.gutter}px`)};
`;
