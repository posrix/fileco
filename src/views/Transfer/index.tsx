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
import { RootState } from 'src/models/store';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import ActionHeader from 'src/components/ActionHeader';
import { Formik, Form, Field } from 'formik';
import ActionFooter from 'src/components/ActionFooter';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import BigNumber from 'bignumber.js';
import {
  Container,
  StyleTextField,
  TransferInfoContainer,
  TransferInfo,
} from './styled';

const Transfer: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

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
            value: new BigNumber(formik.values.amount),
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
        <ActionHeader titleLocaleId="transfer.form.title" gutter={50} />
        <Formik
          initialValues={{
            address: '',
            amount: '',
          }}
          onSubmit={(values) => {
            sendSignedMessage({
              from: address,
              to: values.address,
              value: new BigNumber(values.amount),
              privateKey: extendedKey.privateKey,
            });
            history.push('/home');
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
                  if (Number(value) * 1e18 > balance) {
                    error = intl.formatMessage({
                      id: 'transfer.form.amount.validaton.exceed',
                    });
                  }
                  return error;
                }}
              />
              <ActionFooter />
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
