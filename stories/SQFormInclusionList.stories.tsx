import * as Yup from 'yup';
import React from 'react';
import {Card, Grid} from '@mui/material';
import {
  SQFormInclusionList as SQFormInclusionListComponent,
  SQFormInclusionListItem,
  SQFormHelperText,
} from '../src';
import {SQFormStoryWrapper} from './components/SQFormStoryWrapper';
import {createDocsPage} from './utils/createDocsPage';
import type {FieldArrayRenderProps} from 'formik';
import type {CustomStory} from './types/storyHelperTypes';
import type {SQFormInclusionListProps} from 'components/SQForm/SQFormInclusionList';

export default {
  title: 'Components/SQFormInclusionList',
  component: SQFormInclusionListComponent,
  argTypes: {
    name: {table: {disable: true}},
  },
  parameters: {
    docs: {
      page: createDocsPage(),
    },
  },
};

const MOCK_FORM_FOR_CHECKBOX_GROUP = {
  friends: ['Joe', 'Jane', 'Jack', 'Jill'],
  selectAll: false,
};
const names = [
  'Jim',
  'Jake',
  'John',
  'Jose',
  'Jaipal',
  'Joe',
  'Jane',
  'Jack',
  'Jill',
];

const defaultArgs = {
  name: 'friends',
  selectAllData: names,
  selectAllContainerProps: {
    style: {
      padding: '0 16px',
    },
  },
  selectAllProps: {
    label: 'ALL THE PEEPS',
  },
  children: (arrayHelpers: FieldArrayRenderProps) => {
    const {values} = arrayHelpers.form;
    return (
      <Grid
        container={true}
        direction="column"
        wrap="nowrap"
        style={{
          height: 200,
          overflow: 'auto',
          padding: '0 16px',
        }}
      >
        {names.map((name) => {
          return (
            <Grid item={true} key={name}>
              <SQFormInclusionListItem
                name="friends"
                label={name}
                isChecked={values?.friends?.includes(name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    arrayHelpers.push(name);
                  } else {
                    const idx = values.friends.indexOf(name);
                    arrayHelpers.remove(idx);
                  }
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  },
};

const Template: CustomStory<SQFormInclusionListProps> = (args) => {
  const {schema, sqFormProps, ...rest} = args;

  return (
    <SQFormStoryWrapper
      initialValues={MOCK_FORM_FOR_CHECKBOX_GROUP}
      validationSchema={schema}
      {...sqFormProps}
    >
      <Card raised={true} style={{minWidth: 250, padding: 16}}>
        <SQFormInclusionListComponent {...rest} />
      </Card>
    </SQFormStoryWrapper>
  );
};

const ValidationTemplate: CustomStory<SQFormInclusionListProps> = (args) => {
  const {schema, sqFormProps, ...rest} = args;
  return (
    <SQFormStoryWrapper
      initialValues={MOCK_FORM_FOR_CHECKBOX_GROUP}
      validationSchema={schema}
      {...sqFormProps}
    >
      <Card raised={true} style={{minWidth: 250, padding: 16}}>
        <SQFormInclusionListComponent {...rest} />
        <SQFormHelperText
          errorText={'friends field must have at least 5 items'}
        />
      </Card>
    </SQFormStoryWrapper>
  );
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const WithValidation = ValidationTemplate.bind({});
WithValidation.args = {
  ...defaultArgs,
  schema: Yup.object({
    friends: Yup.array().min(5),
  }),
};
WithValidation.parameters = {
  controls: {exclude: 'schema'},
};
