import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

export const Container = styled.div`
  padding: 20px;
`;

export const StyleTextField = styled(TextField)`
  margin: 10px 0 !important;
`;

export const TransferInfo = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #757575;
`;

export const TransferInfoContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
