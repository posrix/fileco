import React from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from 'src/components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Container, StyleTextField, FormActions } from './styled';

const SetPassword: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

  return (
    <Container>
      <Formik
        initialValues={{
          password: '',
          confirm: '',
        }}
        onSubmit={({ password }) => {
          chrome.storage.sync.set({ password }, function () {
            console.log('password is set to ' + password);
            history.push('/mnemonic');
          });
        }}
        validationSchema={yup.object().shape({
          password: yup
            .string()
            .min(
              2,
              intl.formatMessage({
                id: 'password.create.form.password.validaton.min',
              })
            )
            .max(
              8,
              intl.formatMessage({
                id: 'password.create.form.password.validaton.max',
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
            <Typography variant="h5" gutterBottom>
              <FormattedMessage id="password.create.form.title" />
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <FormattedMessage id="password.create.form.subTitle" />
            </Typography>
            <Field
              id="password"
              type="password"
              label={intl.formatMessage({
                id: 'password.create.form.password',
              })}
              fullWidth
              {...formik.getFieldProps('password')}
              error={!!(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              component={StyleTextField}
            />
            <Field
              id="confirm"
              type="password"
              label={intl.formatMessage({
                id: 'password.create.form.confirm',
              })}
              fullWidth
              {...formik.getFieldProps('confirm')}
              error={!!(formik.touched.confirm && formik.errors.confirm)}
              helperText={formik.touched.confirm && formik.errors.confirm}
              component={StyleTextField}
            />
            <FormActions>
              <Button
                variant="contained"
                fullWidth
                onClick={() => history.goBack()}
              >
                <FormattedMessage id="global.back" />
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
              >
                <FormattedMessage id="global.confirm" />
              </Button>
            </FormActions>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SetPassword;
