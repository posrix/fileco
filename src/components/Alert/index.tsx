import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackbarProps } from '@material-ui/core';
import { AlertProps } from '@material-ui/lab';
import Alert from '@material-ui/lab/Alert';
import { FormattedMessage } from 'react-intl';

interface AlertComponentProps
  extends AlertProps,
    Pick<SnackbarProps, 'autoHideDuration' | 'anchorOrigin'> {
  textLocalId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  clickAwayClose?: boolean;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
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
      <Alert severity={severity}>
        <FormattedMessage id={textLocalId} />
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
