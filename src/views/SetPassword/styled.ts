import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

export const Container = styled.div`
  padding: 20px;
`;

export const StyleTextField = styled(TextField)`
  margin: 10px 0 !important;
`;

export const FormActions = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 15px;
  gap: 10px;
  background: #ffffff;
  box-shadow: 0px 1px 5px 0px rgba(33, 33, 33, 0.16),
    0px 3px 1px -2px rgba(33, 33, 33, 0.08),
    0px 2px 2px 0px rgba(33, 33, 33, 0.1);
`;
