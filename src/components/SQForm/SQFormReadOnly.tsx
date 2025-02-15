import React from 'react';
import {Grid} from '@mui/material';
import {Formik, Form} from 'formik';
import SQFormReadOnlyField from './SQFormReadOnlyField';
import SQFormMaskedReadOnlyField from './SQFormMaskedReadOnlyField';
import {noop} from '../../utils';
import type {CSSProperties} from 'react';
import type {GridProps} from '@mui/material';
import type {FormikValues} from 'formik';
import type {SQFormMaskedReadOnlyFieldProps} from './SQFormMaskedReadOnlyField';

export type SQFormMaskedReadOnlyFieldWithKey =
  SQFormMaskedReadOnlyFieldProps & {
    key?: React.Key;
  };

export type SQFormReadOnlyProps<Values extends FormikValues> = {
  /** Form Input(s) */
  readOnlyFields: SQFormMaskedReadOnlyFieldWithKey[];
  /** Form Entity Object */
  initialValues: Values;
  /** Should SQFormReadOnly reset the form when new initialValues change */
  enableReinitialize?: boolean;
  /** Any prop from https://material-ui.com/api/grid */
  muiGridProps?: GridProps;
};

const noBottomMargin: CSSProperties = {
  marginBottom: 0,
};
const noBottomMarginStyle = {style: noBottomMargin};

function SQFormReadOnly<Values extends FormikValues>({
  readOnlyFields,
  initialValues,
  enableReinitialize = false,
  muiGridProps = {},
}: SQFormReadOnlyProps<Values>): JSX.Element {
  return (
    <Formik<Values>
      initialValues={initialValues}
      onSubmit={noop}
      enableReinitialize={enableReinitialize}
    >
      {(_props) => {
        return (
          <Form>
            <Grid
              {...muiGridProps}
              container={true}
              spacing={muiGridProps.spacing ?? 2}
            >
              {readOnlyFields.map((readOnlyField, index) => {
                const props = {
                  key: readOnlyField?.key ?? index,
                  muiFieldProps: noBottomMarginStyle,
                  ...readOnlyField,
                };

                if (readOnlyField?.mask) {
                  return <SQFormMaskedReadOnlyField {...props} />;
                }
                return <SQFormReadOnlyField {...props} />;
              })}
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}

export default SQFormReadOnly;
