import React from 'react';
import { useHistory } from 'react-router-dom';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { setLocalStorage } from 'src/utils/app';
import * as yup from 'yup';
import PasswordInput from 'src/components/PasswordInput';
import { Container, FormFieldsContainer } from './styled';

const SetPassword: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

  return (
    <Container>
      <CommonPageHeader
        titleLocaleId="password.create.form.title"
        subTitleLocaleId="password.create.form.subTitle"
        gutter={50}
      />
      <Formik
        initialValues={{
          password: '',
          confirm: '',
        }}
        onSubmit={({ password }) => {
          setLocalStorage('password', password);
          history.push('/mnemonic');
        }}
        validateOnBlur={false}
        validationSchema={yup.object().shape({
          password: yup
            .string()
            .min(
              8,
              intl.formatMessage({
                id: 'password.create.form.password.validaton.min',
              })
            )
            .required(
              intl.formatMessage({
                id: 'password.create.form.password.validaton.required',
              })
            ),
          confirm: yup
            .string()
            .oneOf(
              [yup.ref('password'), null],
              intl.formatMessage({
                id: 'password.create.form.password.validaton.match',
              })
            )
            .required(
              intl.formatMessage({
                id: 'password.create.form.confirm.validaton.required',
              })
            ),
        })}
      >
        {(formik) => (
          <Form autoComplete="off">
            <FormFieldsContainer>
              <Field
                id="password"
                label={intl.formatMessage({
                  id: 'password.create.form.password',
                })}
                fullWidth
                {...formik.getFieldProps('password')}
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                component={PasswordInput}
              />
              <Field
                id="confirm"
                label={intl.formatMessage({
                  id: 'password.create.form.confirm',
                })}
                fullWidth
                {...formik.getFieldProps('confirm')}
                error={!!(formik.touched.confirm && formik.errors.confirm)}
                helperText={formik.touched.confirm && formik.errors.confirm}
                component={PasswordInput}
              />
            </FormFieldsContainer>
            <CommonPageFooter />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SetPassword;
