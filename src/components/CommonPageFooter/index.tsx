import React from 'react';
import Button from 'src/components/Button';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { ActionContainer } from './styled';

export interface CommonPageFooterProps {
  onConfirm?: () => void;
  onlyBack?: boolean;
  confirmTextLocaleId?: string;
}

const CommonPageFooter: React.FC<CommonPageFooterProps> = ({
  onConfirm,
  onlyBack,
  confirmTextLocaleId = 'global.confirm',
}) => {
  const history = useHistory();
  return (
    <ActionContainer>
      <Button variant="contained" fullWidth onClick={() => history.goBack()}>
        <FormattedMessage id="global.back" />
      </Button>
      {!onlyBack && (
        <Button
          type={onConfirm ? 'button' : 'submit'}
          variant="contained"
          fullWidth
          color="primary"
          onClick={() => (onConfirm ? onConfirm() : null)}
        >
          <FormattedMessage id={confirmTextLocaleId} />
        </Button>
      )}
    </ActionContainer>
  );
};

export default CommonPageFooter;
