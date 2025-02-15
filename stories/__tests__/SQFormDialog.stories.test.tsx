import React from 'react';
import userEvent from '@testing-library/user-event';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {composeStories} from '@storybook/testing-react';

import * as stories from '../SQFormDialog.stories';

const {Default, WithValidation, WithAutoFocus} = composeStories(stories);

const mockAlert = jest.fn();

window.alert = mockAlert;
const handleClose = jest.fn();
const handleSave = jest.fn();

afterEach(() => {
  mockAlert.mockClear();
  handleClose.mockClear();
  handleSave.mockClear();
});

const mockData = {
  hello: 'howdy',
};

describe('Tests for Default', () => {
  it('should render a form dialog with a title', async () => {
    const dialogTitleValue = 'Test';

    render(
      <Default
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        title={dialogTitleValue}
      />
    );

    const dialogTitle = await waitFor(() =>
      screen.findByText(dialogTitleValue)
    );
    expect(dialogTitle).toHaveTextContent(dialogTitleValue);
  });

  it('should handle form updates and submit said updates on save button click', async () => {
    render(<Default isOpen={true} onSave={handleSave} onClose={handleClose} />);

    const textField = screen.getByLabelText(/hello/i);
    userEvent.type(textField, mockData.hello);

    const saveButton = screen.getByRole('button', {name: /save/i});
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle form updates and submit values on `enter` keydown', async () => {
    render(<Default isOpen={true} onSave={handleSave} onClose={handleClose} />);

    const textField = screen.getByLabelText(/hello/i);
    userEvent.type(textField, mockData.hello);

    // https://testing-library.com/docs/ecosystem-user-event/#specialchars
    userEvent.type(textField, '{enter}');

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onClose on cancel button click', async () => {
    render(<Default isOpen={true} onSave={handleSave} onClose={handleClose} />);

    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onClose on `escape` keydown', async () => {
    render(<Default isOpen={true} onSave={handleSave} onClose={handleClose} />);

    // fireEvent, not userEvent
    // to confirm the 'key' and 'code' values-- > https://keycode.info/
    // https://testing-library.com/docs/dom-testing-library/api-events/ --> find 'keyboard events'
    fireEvent.keyDown(screen.getAllByRole('presentation')[0], {
      key: 'Escape',
      code: 'Escape',
    });

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});

it('should not call onClose on `escape` keydown because cancel is not available', async () => {
  render(
    <Default
      isOpen={true}
      onSave={handleSave}
      onClose={handleClose}
      showSecondaryButton={false}
    />
  );

  // fireEvent, not userEvent
  // to confirm the 'key' and 'code' values-- > https://keycode.info/
  // https://testing-library.com/docs/dom-testing-library/api-events/ --> find 'keyboard events'
  fireEvent.keyDown(screen.getAllByRole('presentation')[0], {
    key: 'Escape',
    code: 'Escape',
  });

  await waitFor(() => {
    expect(handleClose).not.toHaveBeenCalled();
  });
});

it('should not find the cancel secondary button', async () => {
  const dialogTitleValue = 'Test';
  render(
    <Default
      isOpen={true}
      onSave={handleSave}
      onClose={handleClose}
      showSecondaryButton={false}
      title={dialogTitleValue}
    />
  );

  await screen.findByText(dialogTitleValue);

  expect(screen.queryByRole('button', {name: /cancel/i})).toBeNull();
});

describe('Tests for WithValidation', () => {
  it('should disable submit/save until validationSchema satisfied', async () => {
    render(
      <WithValidation isOpen={true} onSave={handleSave} onClose={handleClose} />
    );

    expect(await screen.findByRole('button', {name: /save/i})).toBeDisabled();

    const textField = screen.getByLabelText(/hello/i);
    userEvent.type(textField, mockData.hello);

    expect(await screen.findByRole('button', {name: /save/i})).toBeEnabled();
  });
});

describe('Tests for WithValidation', () => {
  it('should disable tertiary button until validationSchema satisfied', async () => {
    render(
      <WithValidation
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        tertiaryStatus="FORM_VALIDATION_ONLY"
        tertiaryButtonText={'Tertiary'}
      />
    );

    expect(
      await screen.findByRole('button', {name: /Tertiary/i})
    ).toBeDisabled();

    const textField = screen.getByLabelText(/hello/i);
    userEvent.type(textField, mockData.hello);

    expect(
      await screen.findByRole('button', {name: /Tertiary/i})
    ).toBeEnabled();
  });
});

describe('Tests for WithValidation', () => {
  it('should find the correct helper text', async () => {
    render(
      <WithValidation
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        helperText="helper text"
      />
    );
    await waitFor(() => {
      const helperText = screen.getByText(/helper text/i);
      expect(helperText).toBeInTheDocument();
    });
  });
});

describe('Tests for WithAutoFocus', () => {
  it('should render a dialog and automatically focus the form input', async () => {
    render(
      <WithAutoFocus isOpen={true} onSave={handleSave} onClose={handleClose} />
    );

    const dialogTitleValue = 'With Auto Focus';
    const dialogTitle = await waitFor(() =>
      screen.findByText(dialogTitleValue)
    );
    expect(dialogTitle).toHaveTextContent(dialogTitleValue);

    const textfield = screen.getByLabelText(/hello/i);
    expect(textfield).toBe(document.activeElement);
  });
});

describe('Tests for Tertiary Button', () => {
  it('should display the tertiary button', async () => {
    const dialogTitleValue = 'Test';
    const tertiaryButtonText = 'Tertiary Button';
    render(
      <Default
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        tertiaryStatus="IS_ENABLED"
        tertiaryButtonText={tertiaryButtonText}
        title={dialogTitleValue}
      />
    );

    await screen.findByText(dialogTitleValue);

    const tertiaryButton = screen.getByRole('button', {
      name: tertiaryButtonText,
    });

    expect(tertiaryButton).toBeInTheDocument();
    expect(tertiaryButton).toHaveTextContent(tertiaryButtonText);
  });

  it('should not display the tertiary button', async () => {
    const dialogTitleValue = 'Test';
    const tertiaryButtonText = 'Tertiary button';

    render(
      <Default
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        title={dialogTitleValue}
        tertiaryButtonText={tertiaryButtonText}
      />
    );

    await screen.findByText(dialogTitleValue);

    expect(screen.queryByText(tertiaryButtonText)).toBeNull();
  });

  it('should display the tertiary button and it should be disabled', async () => {
    const dialogTitleValue = 'Test';
    const tertiaryButtonText = 'Tertiary Button';
    render(
      <Default
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        tertiaryStatus="IS_DISABLED"
        tertiaryButtonText={tertiaryButtonText}
        title={dialogTitleValue}
      />
    );

    await screen.findByText(dialogTitleValue);

    const tertiaryButton = screen.getByRole('button', {
      name: tertiaryButtonText,
    });

    expect(tertiaryButton).toBeInTheDocument();
    expect(tertiaryButton).toHaveTextContent(tertiaryButtonText);
    expect(
      await screen.findByRole('button', {name: /Tertiary Button/i})
    ).toBeDisabled();
  });
});

describe('Tests for throwAlertOnCancel', () => {
  it('should skip alerts if throwAlertOnCancel is set to false and form is currently dirty', async () => {
    // render component with throwAlertOnCancel set to false
    render(
      <WithValidation
        isOpen={true}
        onSave={handleSave}
        onClose={handleClose}
        throwAlertOnCancel={false}
      />
    );

    // dirty form by filling out text field
    const textField = screen.getByLabelText(/hello/i);
    userEvent.type(textField, mockData.hello);

    // select cancel and see if onClose handler is called
    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should not skip alerts if throwAlertOnCancel is set to true and form is currently dirty', async () => {
    // render component with throwAlertOnCancel set to true (by default)
    render(
      <WithValidation isOpen={true} onSave={handleSave} onClose={handleClose} />
    );

    // dirty form by filling out text field
    const textField = screen.getByLabelText(/hello/i);
    userEvent.type(textField, mockData.hello);

    // select cancel and see if onClose handler is called
    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(0);
    });
  });
});
