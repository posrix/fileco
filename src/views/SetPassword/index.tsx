import React from 'react';
import { useHistory } from 'react-router-dom';
import CommonPageHeader from 'src/components/CommonPageHeader';
import { useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import CommonPageFooter from 'src/components/CommonPageFooter';
import { setLocalStorage } from 'src/utils/app';
import * as yup from 'yup';
import PasswordInput from 'src/components/PasswordInput';
import Checkbox from 'src/components/Checkbox';
import { Container, FormFieldsContainer } from './styled';

const SetPassword: React.FC = () => {
  const history = useHistory();
  const { formatMessage } = useIntl();

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
          term: false,
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
          <Form autoComplete="off">
            <FormFieldsContainer>
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

export default SetPassword;
