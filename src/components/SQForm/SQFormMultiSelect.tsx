import React, {ReactNode} from 'react';
import {
  FormControl,
  Select,
  Input,
  MenuItem,
  InputLabel,
  FormHelperText,
  Grid,
  Checkbox,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {useFormikContext} from 'formik';
import {EMPTY_LABEL} from '../../utils/constants';
import {useForm} from './useForm';
import {
  getOutOfRangeValueWarning,
  getUndefinedChildrenWarning,
  getUndefinedValueWarning,
} from '../../utils/consoleWarnings';
import type {TooltipProps, SelectProps, SelectChangeEvent} from '@mui/material';
import type {
  BaseFieldProps,
  SQFormOption,
  SQFormOptionValue,
} from '../../types';

export type SQFormMultiSelectProps = BaseFieldProps & {
  /** Multiselect options to select from */
  children: SQFormOption[];
  /** Disabled property to disable the input if true */
  isDisabled?: boolean;
  /** Custom onChange event callback */
  onChange?: SelectProps<SQFormOptionValue[] | ''>['onChange'];
  /** This property will allow the end user to check a "Select All" box */
  useSelectAll?: boolean;
  /** Use MUI's Tooltip Position Values */
  toolTipPlacement?: TooltipProps['placement'];
  /** Any valid prop for material ui select child component - https://material-ui.com/api/select/#props  */
  muiFieldProps?: SelectProps<SQFormOptionValue[] | ''>;
  /** Whether or not to show the tooltip */
  showTooltip?: boolean;
  /** String to show as the tooltip.
   * Note: Default behavior is to show the selected value(s)
   */
  tooltipText?: TooltipProps['title'];
};

/**
 * Material UI has a jank issue with the multi select form,
 * requiring us to pass in these MenuProps
 * https://stackoverflow.com/questions/59785482/multiselect-box-popover-keeps-jumping-when-scroll-or-select-items
 */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  variant: 'menu',
  getContentAnchorEl: null,
} as SelectProps<SQFormOptionValue[] | ''>['MenuProps'];

const selectedDisplayValue = (
  values: SQFormOptionValue[] | '',
  options: SQFormMultiSelectProps['children'],
  name?: SQFormMultiSelectProps['name']
) => {
  if (!Array.isArray(values)) {
    return '';
  }

  const selectedValues = values
    .map((value) => {
      return options.find((option) => option.value === value)?.label;
    })
    .join(', ');

  if (!selectedValues) {
    if (name) {
      console.warn(
        getOutOfRangeValueWarning('SQFormMultiSelect', name, values.join(', '))
      );
    }
    return [];
  }

  return selectedValues;
};

const getToolTipTitle = (
  formikFieldValue: SQFormOptionValue[] | '',
  options: SQFormMultiSelectProps['children']
) => {
  if (!formikFieldValue?.length) {
    return 'No value(s) selected';
  }

  return selectedDisplayValue(formikFieldValue, options);
};

const classes = {
  selectHeight: {
    '& .MuiSelect-selectMenu': {
      height: '1.1876em',
    },
  },
};

function SQFormMultiSelect({
  children,
  isDisabled = false,
  label,
  name,
  onChange,
  size = 'auto',
  useSelectAll = true,
  toolTipPlacement = 'bottom',
  muiFieldProps = {},
  showTooltip = true,
  tooltipText,
}: SQFormMultiSelectProps): React.ReactElement {
  const {setFieldValue} = useFormikContext();
  const [toolTipEnabled, setToolTipEnabled] = React.useState(true);
  const {
    formikField: {field},
    fieldState: {isFieldError, isFieldRequired},
    fieldHelpers: {handleBlur, HelperTextComponent},
  } = useForm<SQFormOptionValue[] | '', unknown>({name});

  React.useEffect(() => {
    if (!children) {
      console.warn(getUndefinedChildrenWarning('SQFormMultiSelect', name));
    }

    if (field.value === undefined || field.value === null) {
      console.warn(getUndefinedValueWarning('SQFormMultiSelect', name));
    }
  }, [children, field.value, name]);

  const labelID = label.toLowerCase();
  const toolTipTitle = getToolTipTitle(field.value, children);

  const getIsSelectAllChecked = (value: SQFormOptionValue[]) =>
    value.includes('ALL');
  const getIsSelectNoneChecked = (value: SQFormOptionValue[]) =>
    value.includes('NONE');

  const getValues = (
    children: SQFormMultiSelectProps['children'],
    isSelectAllChecked: boolean,
    isSelectNoneChecked: boolean,
    value: SQFormOptionValue[]
  ) => {
    if (isSelectAllChecked) {
      return children?.map((option) => option.value);
    }

    if (isSelectNoneChecked) {
      return [];
    }

    return value;
  };

  const handleMultiSelectChange = (
    event: SelectChangeEvent<SQFormOptionValue[] | ''>,
    _child: ReactNode
  ) => {
    const value = event.target.value as SQFormOptionValue[];
    const isSelectAllChecked = getIsSelectAllChecked(value);
    const isSelectNoneChecked = getIsSelectNoneChecked(value);
    const values = getValues(
      children,
      isSelectAllChecked,
      isSelectNoneChecked,
      value
    );

    setFieldValue(name, values);
    onChange && onChange(event, value);
  };

  const toggleTooltip = () => {
    setToolTipEnabled(!toolTipEnabled);
  };

  /**
   * this handles scenarios where label and value are not the same,
   * e.g., if value is an "ID"
   */
  const getRenderValue = (selected: unknown) => {
    const getValue = (selectedValues: SQFormOptionValue[]) => {
      if (!selectedValues?.length) {
        return EMPTY_LABEL;
      }

      return selectedDisplayValue(selectedValues, children, name);
    };

    return getValue(selected as SQFormOptionValue[]);
  };

  const renderTooltip = () => {
    if (!showTooltip || !toolTipEnabled) {
      return '';
    }

    return tooltipText || toolTipTitle;
  };

  return (
    <Grid item={true} sm={size}>
      <FormControl
        error={isFieldError}
        disabled={isDisabled}
        required={isFieldRequired}
        fullWidth={true}
      >
        <InputLabel id={labelID}>{label}</InputLabel>
        <Tooltip
          placement={toolTipPlacement}
          arrow={true}
          enterDelay={1000}
          leaveDelay={100}
          title={renderTooltip()}
        >
          <Select<SQFormOptionValue[] | ''>
            sx={classes.selectHeight}
            multiple={true}
            displayEmpty={true}
            input={<Input disabled={isDisabled} name={name} />}
            value={field.value}
            onBlur={handleBlur}
            onChange={handleMultiSelectChange}
            fullWidth={true}
            labelId={labelID}
            renderValue={getRenderValue}
            MenuProps={MenuProps}
            onOpen={toggleTooltip}
            onClose={toggleTooltip}
            {...muiFieldProps}
          >
            {useSelectAll && (
              <MenuItem
                value={
                  children?.length === field.value?.length ? 'NONE' : 'ALL'
                }
              >
                <Checkbox checked={children?.length === field.value?.length} />
                <ListItemText
                  primary="Select All"
                  primaryTypographyProps={{variant: 'body2'}}
                />
              </MenuItem>
            )}
            {children?.map((option) => {
              return (
                <MenuItem key={`${name}_${option.value}`} value={option.value}>
                  <Checkbox
                    checked={
                      Array.isArray(field.value)
                        ? field.value?.includes(option.value)
                        : false
                    }
                  />
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{variant: 'body2'}}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </Tooltip>
        {!isDisabled && <FormHelperText>{HelperTextComponent}</FormHelperText>}
      </FormControl>
    </Grid>
  );
}

export default SQFormMultiSelect;
