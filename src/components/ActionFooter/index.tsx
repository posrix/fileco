import React from 'react';
import Button from 'src/components/Button';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { ActionContainer } from './styled';

export interface ActionFooterProps {
  onConfirm?: () => void;
}

const ActionFooter: React.FC<ActionFooterProps> = ({ onConfirm }) => {
  const history = useHistory();
  return (
    <ActionContainer>
      <Button variant="contained" fullWidth onClick={() => history.goBack()}>
        <FormattedMessage id="global.back" />
      </Button>
      <Button
        type={onConfirm ? 'button' : 'submit'}
        variant="contained"
        fullWidth
        color="primary"
        onClick={() => (onConfirm ? onConfirm() : null)}
      >
        <FormattedMessage id="global.confirm" />
      </Button>
    </ActionContainer>
  );
};

export default ActionFooter;
