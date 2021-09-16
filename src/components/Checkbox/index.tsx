import React, { useRef } from 'react';
import { default as CheckboxComponent } from '@material-ui/core/Checkbox';
import { FieldInputProps } from 'formik';
import { FormattedMessage } from 'react-intl';
import {
  CheckboxContainer,
  TermLabelContainer,
  TermLabelText,
  TermLink,
  CheckboxError,
} from './styled';

interface CheckboxProps extends FieldInputProps<{}> {
  labelTextLocaleId: string;
  labelLinkTextLocaleId: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  labelTextLocaleId,
  labelLinkTextLocaleId,
  error,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const clickTermManually = () => {
    ref && ref.current && ref.current.click();
  };

  return (
    <>
      <CheckboxContainer>
        <CheckboxComponent
          {...props}
          disableRipple
          style={{
            padding: 0,
          }}
          color="primary"
          inputRef={ref}
        />
        <TermLabelContainer>
          {labelTextLocaleId && (
            <TermLabelText onClick={clickTermManually}>
              <FormattedMessage id={labelTextLocaleId} />
            </TermLabelText>
          )}
          {labelLinkTextLocaleId && (
            <TermLink>
              <FormattedMessage id="account.import.form.term" />
            </TermLink>
          )}
        </TermLabelContainer>
      </CheckboxContainer>
      {error && <CheckboxError>{error}</CheckboxError>}
    </>
  );
};

export default Checkbox;
