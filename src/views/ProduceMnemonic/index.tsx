import React from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from 'src/components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { Container } from './styled';

const ProduceMnemonic: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

  return <Container></Container>;
};

export default ProduceMnemonic;
