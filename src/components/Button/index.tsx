import React from 'react';
import styled, { css } from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

const primiaryColorMixin = css`
  background: #131313;
  color: #ffffff;

  &:hover {
    background: #131313;
  }
`;

const StyledButton = styled(Button)`
  background: #eeeeee;
  border-radius: 4px;
  border: 1px solid #bdbdbd;
  box-shadow: none;
  font-weight: 600;
  font-size: 16px;

  ${(props) => (props.color === 'primary' ? primiaryColorMixin : null)}
`;

const adapterProps = {
  disableRipple: true,
  disableElevation: true,
  disableFocusRipple: true,
};

export default (
  props: ButtonProps & React.HTMLAttributes<HTMLButtonElement>
) => <StyledButton {...props} {...adapterProps} />;
