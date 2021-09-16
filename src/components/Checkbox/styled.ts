import styled from 'styled-components';

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  user-select: none;
`;

export const TermLabelContainer = styled.div`
  cursor: pointer;
  display: flex;
  gap: 4px;
`;

export const TermLabelText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #212121;
`;

export const TermLink = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #0075ff;
`;

export const CheckboxError = styled.div`
  font-size: 12px;
  margin-top: 3px;
  font-weight: 400;
  color: #f44336;
`;
