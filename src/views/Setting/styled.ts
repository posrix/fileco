import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const SegmentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const SegmentTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SegmentTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #212121;
`;

export const SegmentSubTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
  line-height: 17px;
`;

export const DividerWrapper = styled.div`
  margin: 14px -20px;
`;

export const LanguageSelectContainer = styled.div`
  margin-top: 24px;
`;
