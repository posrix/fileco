import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { setLocalStorage, setPersistenceMemory } from 'src/utils/app';
import { Dispatch } from 'src/models/store';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Checkbox from 'src/components/Checkbox';
import { useQueryClient } from 'react-query';
import PasswordInput from 'src/components/PasswordInput';
import { Container, FormFieldsContainer } from './styled';

const passworder = require('browser-passworder');

interface ImportWalletProps {
  forgotPassword?: boolean;
}

const ImportWallet: React.FC<ImportWalletProps> = ({ forgotPassword }) => {
  const history = useHistory();
  const termRef = useRef(null);
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<Dispatch>();

  const clickTermManually = () => {
    termRef && termRef.current && termRef.current.click();
  };

  return (
    <Container>
      <CommonPageHeader
        titleLocaleId="account.import.form.title"
        subTitleLocaleId="account.import.form.subTitle"
        gutter={24}
      />
      <Formik
        initialValues={{
          mnemonic: '',
          password: '',
          confirm: '',
          term: false,
        }}
        onSubmit={({ password, mnemonic }) => {
          if (forgotPassword) {
            // make all querys be staled
            queryClient.invalidateQueries();

            // reset all rematch state
            dispatch.app.resetAllState();
          }
          passworder.encrypt(password, mnemonic).then(async (blob: any) => {
            setLocalStorage('mnemonic', blob);
            setPersistenceMemory({
              event: 'SET_PASSWORD',
              entity: { password },
            });

            await dispatch.app.createAccountOrGetExtendedKey({
              password,
            });
            history.push('/home');
          });
        }}
        validateOnBlur={false}
        validationSchema={yup.object().shape({
          mnemonic: yup.string().required(
            formatMessage({
              id: 'account.import.form.mnemonic.validaton.required',
            })
          ),
          password: yup
            .string()
            .min(
              8,
              formatMessage({
                id: 'password.create.form.password.validaton.min',
              })
            )
            .required(
              formatMessage({
                id: 'password.create.form.password.validaton.required',
              })
            ),
          confirm: yup
            .string()
            .oneOf(
              [yup.ref('password'), null],
              formatMessage({
                id: 'password.create.form.password.validaton.match',
              })
            )
            .required(
              formatMessage({
                id: 'password.create.form.confirm.validaton.required',
              })
            ),
          term: yup
            .boolean()
            .required(
              formatMessage({
                id: 'account.import.form.mnemonic.validaton.required',
              })
            )
            .oneOf(
              [true],
              formatMessage({
                id: 'account.import.form.term.validaton.required',
              })
            ),
        })}
      >
        {(formik) => (
          <Form>
            <FormFieldsContainer>
              <Field
                label={formatMessage({
                  id: 'account.import.form.mnemonic',
                })}
                fullWidth
                {...formik.getFieldProps('mnemonic')}
                error={!!(formik.touched.mnemonic && formik.errors.mnemonic)}
                helperText={formik.touched.mnemonic && formik.errors.mnemonic}
                multiline
                variant="outlined"
                rows={4}
                as={TextField}
              />
              <Field
                label={formatMessage({
                  id: 'password.create.form.password',
                })}
                fullWidth
                {...formik.getFieldProps('password')}
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                as={PasswordInput}
              />
              <Field
                label={formatMessage({
                  id: 'password.create.form.confirm',
                })}
                fullWidth
                {...formik.getFieldProps('confirm')}
                error={!!(formik.touched.confirm && formik.errors.confirm)}
                helperText={formik.touched.confirm && formik.errors.confirm}
                as={PasswordInput}
              />
              <Field
                {...formik.getFieldProps('term')}
                labelTextLocaleId="account.import.form.term.read"
                labelLinkTextLocaleId="account.import.form.term"
                error={formik.touched.term && formik.errors.term}
                as={Checkbox}
              />
            </FormFieldsContainer>
            <CommonPageFooter />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ImportWallet;
