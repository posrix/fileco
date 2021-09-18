import React from 'react';
import { useHistory } from 'react-router-dom';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { getPersistenceMemory } from 'src/utils/app';
import { Dispatch } from 'src/models/store';
import { useDispatch } from 'react-redux';
import Alert from 'src/components/Alert';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import { Container, FormFieldsContainer } from './styled';

const ImportAccount: React.FC = () => {
  const [showError, setShowError] = React.useState(false);
  const [isDupAccount, setIsDupAccount] = React.useState(false);

  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch<Dispatch>();

  return (
    <Container>
      <CommonPageHeader
        titleLocaleId="external.account.import.form.title"
        subTitleLocaleId="external.account.import.form.subTitle"
        gutter={24}
      />
      <Formik
        initialValues={{
          privateKey: '',
        }}
        onSubmit={({ privateKey }) => {
          getPersistenceMemory({
            event: 'GET_PASSWORD',
            key: 'password',
          }).then(async (password) => {
            try {
              await dispatch.app.createExternalAccount({
                password,
                privateKey,
              });
              history.push('/home');
            } catch (error) {
              setShowError(true);
              if ((error as any).isDup) {
                setIsDupAccount(true);
              } else {
                setIsDupAccount(false);
              }
            }
          });
        }}
        validateOnBlur={false}
        validationSchema={yup.object().shape({
          privateKey: yup.string().required(
            formatMessage({
              id: 'external.account.import.form.privateKey.validaton.required',
            })
          ),
        })}
      >
        {(formik) => (
          <Form autoComplete="off">
            <FormFieldsContainer>
              <Field
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                label={formatMessage({
                  id: 'external.account.import.form.privateKey',
                })}
                fullWidth
                {...formik.getFieldProps('privateKey')}
                error={
                  !!(formik.touched.privateKey && formik.errors.privateKey)
                }
                helperText={
                  formik.touched.privateKey && formik.errors.privateKey
                }
                multiline
                variant="outlined"
                rows={4}
                as={TextField}
              />
            </FormFieldsContainer>
            <CommonPageFooter />
          </Form>
        )}
      </Formik>
      <Alert
        open={showError}
        setOpen={setShowError}
        severity="error"
        textLocalId={
          isDupAccount
            ? 'external.account.import.form.error.dup'
            : 'external.account.import.form.error.common'
        }
      />
    </Container>
  );
};

export default ImportAccount;
