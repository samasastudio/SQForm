import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  makeStyles
} from '@material-ui/core';
import {Formik, Form} from 'formik';
import SQFormButton from '../SQForm/SQFormButton';
import SQFormHelperText from '../SQForm/SQFormHelperText';

const useStyles = makeStyles(theme => {
  return {
    form: {
      height: '100%',
      width: '100%'
    },
    card: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateAreas: `'header' 'content' 'footer'`,
      height: '100%'
    },
    cardHeader: {
      gridArea: 'header',
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
    },
    cardContent: {
      gridArea: 'content',
      overflowY: 'auto',
      padding: ({hasSubHeader}) => {
        return hasSubHeader
          ? theme.spacing(2)
          : `${theme.spacing(2)}px ${theme.spacing(4)}px`;
      }
    },
    cardFooter: {
      gridArea: 'footer',
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
    }
  };
});

function SQFormScrollableCard({
  children,
  enableReinitialize = false,
  helperErrorText,
  helperFailText,
  helperValidText,
  initialValues,
  isDisabled = false,
  isFailedState = false,
  muiGridProps = {},
  onSubmit,
  resetButtonText = 'Reset',
  shouldRenderHelperText = true,
  submitButtonText = 'Submit',
  SubHeaderComponent,
  title,
  validationSchema
}) {
  const hasSubHeader = Boolean(SubHeaderComponent);
  const classes = useStyles({hasSubHeader});

  return (
    <Formik
      enableReinitialize={enableReinitialize}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {() => {
        return (
          <Form className={classes.form}>
            <Card
              raised={true}
              elevation={1}
              square={true}
              className={classes.card}
            >
              <CardHeader
                title={title}
                className={classes.cardHeader}
                titleTypographyProps={{variant: 'h4'}}
              />
              <CardContent className={classes.cardContent}>
                {SubHeaderComponent}
                <Grid
                  container
                  spacing={muiGridProps.spacing ?? 2}
                  {...muiGridProps}
                >
                  {children}
                </Grid>
              </CardContent>
              <CardActions className={classes.cardFooter}>
                <SQFormButton
                  variant="outlined" // TODO: Make it Ghost Button
                  type="reset"
                  title="Reset Form"
                >
                  {resetButtonText}
                </SQFormButton>
                {shouldRenderHelperText && (
                  <SQFormHelperText
                    isFailedState={isFailedState}
                    helperErrorText={helperErrorText}
                    helperFailText={helperFailText}
                    helperValidText={helperValidText}
                  />
                )}
                <SQFormButton isDisabled={isDisabled}>
                  {submitButtonText}
                </SQFormButton>
              </CardActions>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
}

SQFormScrollableCard.propTypes = {
  /** Form related Field(s) and components */
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType])
    .isRequired,
  /** Reinitialize form values when props change - https://formik.org/docs/api/formik#enablereinitialize-boolean */
  enableReinitialize: PropTypes.bool,
  /** Helper text to display in the Footer when the Form is in an Error state */
  helperErrorText: PropTypes.string,
  /** Helper text to display in the Footer when the Form is in a Failure state */
  helperFailText: PropTypes.string,
  /** Helper text to display in the Footer when the Form is in a Valid state */
  helperValidText: PropTypes.string,
  /** Form Entity Object aka initial values of the form */
  initialValues: PropTypes.object.isRequired,
  /** Imperatively disable the Form Submit button */
  isDisabled: PropTypes.bool,
  /** Any prop from https://material-ui.com/api/grid */
  muiGridProps: PropTypes.object,
  /**
   * Form Submission Handler | @typedef onSubmit: (values: Values, formikBag: FormikBag) => void | Promise<any>
   * IMPORTANT: If onSubmit is async, then Formik will automatically set isSubmitting to false on your behalf once it has resolved.
   * This means you do NOT need to call formikBag.setSubmitting(false) manually.
   * However, if your onSubmit function is synchronous, then you need to call setSubmitting(false) on your own.
   *
   * https://jaredpalmer.com/formik/docs/api/withFormik#handlesubmit-values-values-formikbag-formikbag--void--promiseany
   * */
  onSubmit: PropTypes.func.isRequired,
  /** Label text for the reset button */
  resetButtonText: PropTypes.string,
  /** Label text for the Submit button */
  submitButtonText: PropTypes.string,
  /** The Title for the Header component */
  title: PropTypes.string.isRequired,
  /** Component to render as the Subheader */
  SubHeaderComponent: PropTypes.element,
  /**
   * Yup validation schema shape
   * https://jaredpalmer.com/formik/docs/guides/validation#validationschema
   * */
  validationSchema: PropTypes.object
};

export default SQFormScrollableCard;
