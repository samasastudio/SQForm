import React from 'react';
import {Grid} from '@mui/material';
import {SQFormButton as SQFormButtonComponent, SQFormTextField} from '../src';
import {SQFormStoryWrapper} from './components/SQFormStoryWrapper';
import {createDocsPage} from './utils/createDocsPage';
import type {Story, Meta} from '@storybook/react';
import type {SQFormButtonProps} from 'components/SQForm/SQFormButton';

export default {
  title: 'Components/SQFormButton',
  component: SQFormButtonComponent,
  argTypes: {
    onClick: {action: 'clicked', table: {disable: true}},
  },
  parameters: {
    docs: {
      page: createDocsPage(),
    },
  },
} as Meta;

const defaultArgs = {
  children: 'Submit',
};

// prevents synthetic event warnings
const handleClick = (event: React.FormEvent) => event.persist();

export const Default: Story<SQFormButtonProps> = (args) => {
  return (
    <SQFormStoryWrapper
      initialValues={{}}
      showSubmit={false}
      validationSchema={undefined}
      muiGridProps={{}}
    >
      <SQFormButtonComponent onClick={handleClick} {...args} />
    </SQFormStoryWrapper>
  );
};
Default.args = defaultArgs;

export const WithTestField: Story<SQFormButtonProps> = (args) => {
  return (
    <SQFormStoryWrapper
      initialValues={{testField: ''}}
      showSubmit={false}
      validationSchema={undefined}
      muiGridProps={{}}
    >
      <Grid container={true} sx={{alignItems: 'center'}} spacing={2}>
        <Grid item={true}>
          <SQFormTextField name="testField" label="Test Field" />
        </Grid>
        <Grid item={true}>
          <SQFormButtonComponent onClick={handleClick} {...args} />
        </Grid>
      </Grid>
    </SQFormStoryWrapper>
  );
};
WithTestField.args = defaultArgs;
