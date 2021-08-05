import React from 'react';
import {FormikValues} from 'formik';
import {useDialog} from '@selectquotelabs/sqhooks';
import {DialogAlert, TextButton} from 'scplus-shared-components';
import {useFormButton} from './useFormButton';

interface SQFormResetInitialValuesButtonProps {
  /** Content for the button; usually text */
  children: React.ReactNode;
  /** Title for the confirmation dialog */
  confirmationTitle?: string;
  /** Content for the confirmation dialog */
  confirmationContent: React.ReactNode;
  /** Whether the button is disabled */
  isDisabled?: boolean;
  /** Title for the button */
  buttonTitle?: string;
  /** initial form values */
  initialValuesObject?: FormikValues;
  /** Button tooltip */
  tooltip?: string;
}

function SQFormResetInitialValuesButton({
  children,
  isDisabled = false,
  buttonTitle = 'Form Reset',
  confirmationContent,
  confirmationTitle = 'Reset Form',
  tooltip = 'Reset Button',
  initialValuesObject = {},
  ...props
}: SQFormResetInitialValuesButtonProps): JSX.Element {
  const {isDialogOpen, openDialog, closeDialog} = useDialog();
  const {values, resetForm} = useFormButton(isDisabled, false);

  const handlePrimaryButtonClick = (): void => {
    //TODO: Remove FormikValues once useFormButton types are improved
    resetForm({
      values: {
        ...(values as FormikValues),
        ...initialValuesObject
      }
    });

    closeDialog();
  };

  return (
    <>
      <TextButton
        tooltip={tooltip}
        title={buttonTitle}
        isDisabled={isDisabled}
        onClick={openDialog}
        {...props}
      >
        {children}
      </TextButton>
      <DialogAlert
        isOpen={isDialogOpen}
        title={confirmationTitle}
        primaryButtonText="Reset"
        onPrimaryButtonClick={handlePrimaryButtonClick}
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={closeDialog}
      >
        {confirmationContent}
      </DialogAlert>
    </>
  );
}

export default SQFormResetInitialValuesButton;
