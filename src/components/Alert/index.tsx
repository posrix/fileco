import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarProps } from '@material-ui/core';
import { AlertProps as AlertComponentProps } from '@material-ui/lab';
import AlertComponent from '@material-ui/lab/Alert';
import { FormattedMessage } from 'react-intl';

// override the top center position css to adjust width
export const SnackbarOverrideStyle = createGlobalStyle`
  .MuiOverride-snackbar-top-center {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
`;

interface AlertProps
  extends AlertComponentProps,
    Pick<SnackbarProps, 'autoHideDuration' | 'anchorOrigin'> {
  textLocalId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  clickAwayClose?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  textLocalId,
  severity,
  open,
  setOpen,
  clickAwayClose = true,
  autoHideDuration = 3000,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'center',
  },
}) => {
  return (
    <>
      <Snackbar
        anchorOrigin={anchorOrigin}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={(_, reason) => {
          if (reason === 'clickaway' && !clickAwayClose) {
            return;
          }
          setOpen(false);
        }}
        classes={{
          anchorOriginTopCenter: 'MuiOverride-snackbar-top-center',
        }}
      >
        <AlertComponent severity={severity}>
          <FormattedMessage id={textLocalId} />
        </AlertComponent>
      </Snackbar>
      <SnackbarOverrideStyle />
    </>
  );
};

export default Alert;
