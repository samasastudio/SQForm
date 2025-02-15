import React from 'react';
import {ClickAwayListener, Grid, TextField} from '@mui/material';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {useForm} from './useForm';
import type {MarkOptional} from 'ts-essentials';
import type {Moment} from 'moment';
import type {BaseDateTimePickerProps} from '@mui/x-date-pickers/DateTimePicker/shared';
import type {BaseFieldProps} from '../../types';

export type SQFormDateTimePickerProps = BaseFieldProps & {
  /** Disabled property to disable the input if true */
  isDisabled?: boolean;
  /** Placeholder text used inside the input field to provide hints to the user */
  placeholder?: string;
  /** Custom onBlur event callback */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Custom onChange event callback */
  onChange?: (date: Moment | null) => void;
  /** Any valid prop for material ui datetimepicker child component - https://material-ui.com/components/pickers/  */
  muiFieldProps?: MarkOptional<
    BaseDateTimePickerProps<Moment, Moment>,
    'onChange' | 'value' | 'renderInput'
  >;
};

function SQFormDateTimePicker({
  name,
  label,
  size = 'auto',
  isDisabled = false,
  placeholder = '',
  onBlur,
  onChange,
  muiFieldProps = {},
}: SQFormDateTimePickerProps): JSX.Element {
  const {
    formikField: {field, helpers},
    fieldState: {isFieldError, isFieldRequired},
    fieldHelpers: {handleBlur, HelperTextComponent},
  } = useForm<Moment | null, unknown>({
    name,
    onBlur,
  });

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const handleClose = () => setIsCalendarOpen(false);
  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);
  const handleClickAway = () => {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
    }
  };

  // An empty string will not reset the DatePicker so we have to pass null
  const value: Moment | null = (field.value as Moment) ?? null;

  const handleChange = (date: Moment | null): void => {
    helpers.setValue(date);
    onChange && onChange(date);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Grid item={true} sm={size}>
        <DateTimePicker
          label={label}
          disabled={isDisabled}
          value={value}
          onChange={handleChange}
          onClose={handleClose}
          onOpen={toggleCalendar}
          open={isCalendarOpen}
          renderInput={(inputProps) => {
            return (
              <TextField
                {...inputProps}
                name={name}
                color="primary"
                variant="standard"
                disabled={isDisabled}
                error={isFieldError}
                fullWidth={true}
                InputLabelProps={{shrink: true}}
                FormHelperTextProps={{error: isFieldError}}
                helperText={!isDisabled && HelperTextComponent}
                placeholder={placeholder}
                onBlur={handleBlur}
                onClick={handleClickAway}
                required={isFieldRequired}
                sx={{
                  '& .MuiInputBase-root.Mui-focused, & .MuiInputBase-root:hover:not(.Mui-disabled)':
                    {
                      '& .MuiIconButton-root': {
                        color: 'var(--color-teal)',
                      },
                    },
                }}
              />
            );
          }}
          {...muiFieldProps}
        />
      </Grid>
    </ClickAwayListener>
  );
}

export default SQFormDateTimePicker;
