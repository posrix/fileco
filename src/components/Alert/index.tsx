import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarProps } from '@material-ui/core';
import { AlertProps as AlertComponentProps } from '@material-ui/lab';
import AlertComponent from '@material-ui/lab/Alert';
import { FormattedMessage } from 'react-intl';

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
  clickAwayClose = false,
  autoHideDuration = 3000,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'center',
  },
}) => {
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={(_, reason) => {
        if (reason === 'clickaway' && clickAwayClose) {
          return;
        }
        setOpen(false);
      }}
    >
      <AlertComponent severity={severity}>
        <FormattedMessage id={textLocalId} />
      </AlertComponent>
    </Snackbar>
  );
};

export default Alert;
