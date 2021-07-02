import React from 'react';
import Button from 'src/components/Button';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { ActionContainer } from './styled';

interface ActionFooterProps {
  nextRoute?: string;
}

const ActionFooter: React.FC<ActionFooterProps> = ({ nextRoute }) => {
  const history = useHistory();
  return (
    <ActionContainer>
      <Button variant="contained" fullWidth onClick={() => history.goBack()}>
        <FormattedMessage id="global.back" />
      </Button>
      <Button
        type={nextRoute ? 'button' : 'submit'}
        variant="contained"
        fullWidth
        color="primary"
        onClick={() => (nextRoute ? history.push(nextRoute) : null)}
      >
        <FormattedMessage id="global.confirm" />
      </Button>
    </ActionContainer>
  );
};

export default ActionFooter;
