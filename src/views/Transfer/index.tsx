import React, { useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  convertByUnit,
  convertToFilUnit,
  getPersistenceMemory,
} from 'src/utils/app';
import { MessageStatus } from 'src/types/app';
import {
  sendSignedMessage,
  constructUnsignedMessage,
  getEstimateGas,
} from 'src/utils/lotus';
import { useQuery } from 'react-query';
import CommonPageHeader from 'src/components/CommonPageHeader';
import {
  Formik,
  Form,
  Field,
  FormikProps,
  FormikValues,
  FormikErrors,
} from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import Alert from 'src/components/Alert';
import TextField from '@material-ui/core/TextField';
import { RootState } from 'src/models/store';
import { Dispatch } from 'src/models/store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import moment from 'moment';
import TransferSent from './TransferSent';
import {
  Container,
  FormFieldWrapper,
  TransferInfoContainer,
  TransferInfo,
} from './styled';

const Transfer: React.FC = () => {
  const [gas, setGas] = useState(0);
  const [sentAmount, setSentAmount] = useState(0);
  const [extendedKey, setExtendedKey] = useState(null);
  const [showError, setShowError] = React.useState(false);

  const { formatMessage } = useIntl();

  const dispatch = useDispatch<Dispatch>();
  const {
    address,
    balance,
    selectedNetwork,
    isExternal,
    accountId,
    selectedAccountId,
  } = useSelector((state: RootState) => {
    const selectedAccountId = state.app.selectedAccountId;
    const account = state.app.accounts[state.app.selectedAccountId];
    const selectedNetwork = state.app.selectedNetwork;
    return {
      accountId: account.accountId,
      address: account.address,
      isExternal: account.isExternal,
      balance: account.balances[selectedNetwork],
      selectedNetwork,
      selectedAccountId,
    };
  });

  const initialValues = {
    address: '',
    amount: '',
  };

  useEffect(() => {
    async function getExtendedKey() {
      const password = await getPersistenceMemory({
        event: 'GET_PASSWORD',
        key: 'password',
      });
      const extendedKey = !isExternal
        ? await dispatch.app.createAccountOrGetExtendedKey({
            password,
            accountId: selectedAccountId,
          })
        : await dispatch.app.getExternalAccountExtendedKey({
            password,
          });
      setExtendedKey(extendedKey);
    }
    getExtendedKey();
  }, [isExternal, selectedAccountId]);

  useQuery(
    ['balance', address, selectedNetwork],
    () =>
      dispatch.app.fetchBalance({
        network: selectedNetwork,
        address,
        accountId,
      }),
    {
      enabled: !!address && !!selectedNetwork,
    }
  );

  const fetchGas = (values: FormikValues) => {
    return getEstimateGas(
      constructUnsignedMessage({
        from: address,
        to: values.address,
        value: Number(values.amount) * 1e18,
      })
    )
      .then((data) => {
        setGas(Number(data.gasFeeCap));
      })
      .catch((error) => {
        console.error('[Fetch Gas Failed]', error);
        setShowError(true);
      });
  };

  const fetchGasHandle = (formik: FormikProps<typeof initialValues>) => {
    formik.validateForm().then((errors: FormikErrors<typeof initialValues>) => {
      if (isEmpty(errors)) {
        fetchGas(formik.values);
      }
    });
  };

  const transferSubmitHandle = useCallback(
    async (values: FormikValues) => {
      // Fetch gas again because formik error detect will delay while first input
      await fetchGas(values);
      const amountWithGas = Number(values.amount) * Math.pow(10, 18) - gas;
      const base = {
        from: address,
        to: values.address,
        value: amountWithGas,
      };
      // set temp balance
      dispatch.app.setBalance({
        balance: balance - amountWithGas,
        accountId,
        network: selectedNetwork,
      });
      const cid = await sendSignedMessage({
        ...base,
        privateKey: extendedKey.privateKey,
      });
      dispatch.app
        .pushAndPollingPendingMessage({
          ...base,
          cid,
          datetime: moment().format('YYYY/MM/DD h:mm:ss'),
          height: 0,
          status: MessageStatus.PENDING,
        })
        .catch((error) => {
          console.error('[Transfer Failed]', error);
          // resotre balance while transaction failed
          dispatch.app.setBalance({
            balance: balance + amountWithGas,
            accountId,
            network: selectedNetwork,
          });
        });
      setSentAmount(amountWithGas);
    },
    [gas]
  );

  const validationSchema = yup.object().shape({
    address: yup
      .string()
      .required(
        formatMessage({
          id: 'transfer.form.address.validaton.required',
        })
      )
      .notOneOf(
        [address],
        formatMessage({
          id: 'transfer.form.address.validaton.self',
        })
      ),
    amount: yup
      .number()
      .nullable(true)
      .typeError(
        formatMessage({
          id: 'transfer.form.amount.validaton.type',
        })
      )
      .max(
        balance * Math.pow(10, -18),
        formatMessage({
          id: 'transfer.form.amount.validaton.exceed',
        })
      )
      .required(
        formatMessage({
          id: 'transfer.form.amount.validaton.required',
        })
      ),
  });

  return (
    <Container>
      <CommonPageHeader titleLocaleId="transfer.form.title" gutter={50} />
      <Formik
        initialValues={initialValues}
        onSubmit={transferSubmitHandle}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form>
            <FormFieldWrapper>
              <Field
                label={formatMessage({
                  id: 'transfer.form.address',
                })}
                fullWidth
                {...formik.getFieldProps('address')}
                error={!!(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                onBlur={() => fetchGasHandle(formik)}
                as={TextField}
              />
              <Field
                autoComplete="off"
                label={formatMessage({
                  id: 'transfer.form.amount',
                })}
                fullWidth
                {...formik.getFieldProps('amount')}
                error={!!(formik.touched.amount && formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                onBlur={() => fetchGasHandle(formik)}
                as={TextField}
              />
            </FormFieldWrapper>
            <CommonPageFooter />
          </Form>
        )}
      </Formik>
      <TransferInfoContainer>
        <TransferInfo>
          <FormattedMessage
            id="transfer.form.info.balance.available"
            values={{ balance: convertToFilUnit(balance) }}
          />
        </TransferInfo>
        <TransferInfo>
          <FormattedMessage
            id="transfer.form.info.gas.estimate"
            values={{ gas: convertByUnit(gas) }}
          />
        </TransferInfo>
      </TransferInfoContainer>
      <TransferSent amount={sentAmount} />
      <Alert
        open={showError}
        setOpen={setShowError}
        severity="error"
        textLocalId="transfer.failed"
      />
    </Container>
  );
};

export default Transfer;
