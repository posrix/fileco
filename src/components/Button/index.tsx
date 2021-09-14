import React from 'react';
import { StyledButton } from './styled';
import { ButtonProps } from '@material-ui/core/Button';

const adapterProps = {
  disableRipple: true,
  disableElevation: true,
  disableFocusRipple: true,
};

export default (
  props: ButtonProps & React.HTMLAttributes<HTMLButtonElement>
) => <StyledButton {...props} {...adapterProps} />;
