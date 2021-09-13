import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
`;

export const FormFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
`;

export const TermsLabelContainer = styled.div`
  display: flex;
  gap: 4px;
`;

export const TermsLabelText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #212121;
`;

export const TermsLink = styled.div`
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
