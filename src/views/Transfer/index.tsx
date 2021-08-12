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
import { Formik, Form, Field } from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import moment from 'moment';
import {
  Container,
  StyleTextField,
  TransferInfoContainer,
  TransferInfo,
} from './styled';
import { MessageStatus } from 'src/types/app';

const Transfer: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

  const dispatch = useDispatch<Dispatch>();
  const [gasEstimate, setGasEstimate] = useState(0);
  const { address, extendedKey } = useSelector((state: RootState) => state.app);

  const { data: balance = 0 } = useQuery(
    ['balance', address],
    () => WrappedLotusRPC.client.walletBalance(address),
    {
      enabled: !!address,
    }
  );

  const gasEstimateHandler = (formik: any) => {
    formik.validateForm().then((errors: any) => {
      if (isEmpty(errors)) {
        getEstimateGas(
          constructUnsignedMessage({
            from: address,
            to: formik.values.address,
            value: Number(formik.values.amount) * 1e18,
          })
        ).then((estimateGas) => {
          setGasEstimate(estimateGas.gasFeeCap);
        });
      }
    });
  };

  return (
    <>
      <Header />
      <Container>
        <CommonPageHeader titleLocaleId="transfer.form.title" gutter={50} />
        <Formik
          initialValues={{
            address: '',
            amount: '',
          }}
          onSubmit={(values) => {
            const base = {
              from: address,
              to: values.address,
              value: Number(values.amount) * 1e18,
            };
            sendSignedMessage({
              ...base,
              privateKey: extendedKey.privateKey,
            }).then((cid) => {
              dispatch.app.incrementalPushMessage({
                ...base,
                cid,
                datetime: moment().format('YYYY/MM/DD h:mm:ss'),
                height: 0,
                status: MessageStatus.PENDING,
              });
              history.push('/home');
            });
          }}
          validationSchema={yup.object().shape({
            address: yup.string().required(
              intl.formatMessage({
                id: 'transfer.form.address.validaton.required',
              })
            ),
            amount: yup.string().required(
              intl.formatMessage({
                id: 'transfer.form.amount.validaton.required',
              })
            ),
          })}
          validateOnBlur={false}
        >
          {(formik) => (
            <Form>
              <Field
                id="address"
                label={intl.formatMessage({
                  id: 'transfer.form.address',
                })}
                fullWidth
                {...formik.getFieldProps('address')}
                error={!!(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                onBlur={() => gasEstimateHandler(formik)}
                component={StyleTextField}
              />
              <Field
                id="amount"
                label={intl.formatMessage({
                  id: 'transfer.form.amount',
                })}
                fullWidth
                {...formik.getFieldProps('amount')}
                error={!!(formik.touched.amount && formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                onBlur={() => gasEstimateHandler(formik)}
                component={StyleTextField}
                validate={(value: string) => {
                  let error;
                  if (Number(value) > balance) {
                    error = intl.formatMessage({
                      id: 'transfer.form.amount.validaton.exceed',
                    });
                  }
                  return error;
                }}
              />
              <CommonPageFooter />
            </Form>
          )}
        </Formik>
        <TransferInfoContainer>
          <TransferInfo>
            <FormattedMessage
              id="transfer.form.info.balance.available"
              values={{ balance: getFilByUnit(balance) }}
            />
          </TransferInfo>
          <TransferInfo>
            <FormattedMessage
              id="transfer.form.info.gas.estimate"
              values={{ gasEstimate: getFilByUnit(gasEstimate) }}
            />
          </TransferInfo>
        </TransferInfoContainer>
      </Container>
    </>
  );
};

export default Transfer;
