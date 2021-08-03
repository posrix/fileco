import styled from 'styled-components';
import { CommonPageHeaderProps } from '.';

export const Title = styled.div`
  margin-top: 20px;
  font-weight: 600;
  font-size: 24px;
  color: #212121;
`;

export const SubTitle = styled.div`
  font-size: 14px;
  color: #212121;
  margin-top: 8px;
`;

export const TitleContainer = styled.div<Pick<CommonPageHeaderProps, 'gutter'>>`
  margin-bottom: ${(props) => (!props.gutter ? '20px' : `${props.gutter}px`)};
`;
