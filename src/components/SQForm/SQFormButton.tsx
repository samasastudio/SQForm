import React from 'react';
import {RoundedButton} from 'scplus-shared-components';
import {useFormButton, BUTTON_TYPES} from './useFormButton';
import type {ButtonType} from './useFormButton';

export type SQFormButtonProps<Values = void> = {
  children: React.ReactNode;
  isDisabled?: boolean;
  shouldRequireFieldUpdates?: boolean;
  title?: string;
  type?: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  initialValues?: Values;
};

function SQFormButton<Values = void>({
  children,
  isDisabled = false,
  shouldRequireFieldUpdates = false,
  title,
  type = 'submit',
  onClick,
  initialValues,
}: SQFormButtonProps<Values>): JSX.Element {
  const isResetButton = type === BUTTON_TYPES.RESET;
  const {isButtonDisabled, setValues, handleReset, handleClick} = useFormButton(
    {
      isDisabled,
      shouldRequireFieldUpdates,
      onClick,
      buttonType: type,
    }
  );

  const getClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isResetButton) {
      /* There is a Formik bug where simply calling handleReset does not cause the form to re-validate.
          To fix this, we allow the user to optionally pass in the form's initial values and manually reset the form.
          Github Issue: https://github.com/jaredpalmer/formik/issues/3512 */
      return initialValues ? () => setValues(initialValues) : handleReset;
    } else if (typeof onClick !== 'undefined') {
      return handleClick(event);
    }
  };

  const getTitle = () => {
    switch (true) {
      case Boolean(title):
        return title;
      case isResetButton:
        return 'Reset Form';
      default:
        return 'Form Submission';
    }
  };

  return (
    <RoundedButton
      title={getTitle()}
      type={type}
      isDisabled={isButtonDisabled}
      onClick={getClickHandler}
      variant={isResetButton ? 'outlined' : 'contained'}
    >
      {children}
    </RoundedButton>
  );
}

export default SQFormButton;
