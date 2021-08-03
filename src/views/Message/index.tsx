import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  WrappedLotusRPC,
  sendSignedMessage,
  constructUnsignedMessage,
  getEstimateGas,
  getFilByUnit,
} from 'src/utils/app';
import Header from 'src/views/Header';
import { useQuery } from 'react-query';
import CommonPageHeader from 'src/components/CommonPageHeader';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import moment from 'moment';
import { Container } from './styled';

const Message: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

  const dispatch = useDispatch<Dispatch>();
  const [gasEstimate, setGasEstimate] = useState(0);
  const { address, extendedKey } = useSelector((state: RootState) => state.app);

  return (
    <>
      <Header />
      <Container>
        <CommonPageHeader titleLocaleId="transfer.form.title" gutter={50} />
        <CommonPageFooter onlyBack />
      </Container>
    </>
  );
};

export default Message;
