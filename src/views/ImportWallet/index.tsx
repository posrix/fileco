import React from 'react';
import { useHistory } from 'react-router-dom';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { setLocalStorage, setPersistenceMemory } from 'src/utils/app';
import { Dispatch } from 'src/models/store';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { useQueryClient } from 'react-query';
import {
  Container,
  FormFieldsContainer,
  CheckboxContainer,
  TermsLabelContainer,
  TermsLabelText,
  TermsLink,
  CheckboxError,
} from './styled';

const passworder = require('browser-passworder');

interface ImportWalletProps {
  forgotPassword?: boolean;
}

const ImportWallet: React.FC<ImportWalletProps> = ({ forgotPassword }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<Dispatch>();

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
          terms: false,
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
              2,
              formatMessage({
                id: 'password.create.form.password.validaton.min',
              })
            )
            .max(
              30,
              formatMessage({
                id: 'password.create.form.password.validaton.max',
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
          terms: yup
            .boolean()
            .required(
              formatMessage({
                id: 'account.import.form.mnemonic.validaton.required',
              })
            )
            .oneOf(
              [true],
              formatMessage({
                id: 'account.import.form.terms.validaton.required',
              })
            ),
        })}
      >
        {(formik) => (
          <Form autoComplete="off">
            <FormFieldsContainer>
              <Field
                id="mnemonic"
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
                component={TextField}
              />
              <Field
                id="password"
                type="password"
                label={formatMessage({
                  id: 'password.create.form.password',
                })}
                fullWidth
                {...formik.getFieldProps('password')}
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                component={TextField}
              />
              <Field
                id="confirm"
                type="password"
                label={formatMessage({
                  id: 'password.create.form.confirm',
                })}
                fullWidth
                {...formik.getFieldProps('confirm')}
                error={!!(formik.touched.confirm && formik.errors.confirm)}
                helperText={formik.touched.confirm && formik.errors.confirm}
                component={TextField}
              />
              <CheckboxContainer>
                <Field
                  id="terms"
                  {...formik.getFieldProps('terms')}
                  color="primary"
                  disableRipple
                  component={Checkbox}
                  style={{
                    padding: 0,
                  }}
                />
                <TermsLabelContainer>
                  <TermsLabelText>
                    <FormattedMessage id="account.import.form.terms.read" />
                  </TermsLabelText>
                  <TermsLink>
                    <FormattedMessage id="account.import.form.terms" />
                  </TermsLink>
                </TermsLabelContainer>
              </CheckboxContainer>
              {formik.touched.terms && formik.errors.terms && (
                <CheckboxError>{formik.errors.terms}</CheckboxError>
              )}
            </FormFieldsContainer>
            <CommonPageFooter />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ImportWallet;
