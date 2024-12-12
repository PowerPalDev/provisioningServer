import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import RequestFailedPopUp from '../../../components/Dialogs/errors/RequestFailedPopUp';

type RequestFailedProps = {
    open: boolean;
    onClose: () => void;
    errorText: string;
  }

export default {
  title: 'Components/RequestFailedPopUp',
  component: RequestFailedPopUp,
  argTypes: {
    open: { control: 'boolean' },
    errorText: { control: 'text' },
  },
} as Meta;

// Explicitly typing the args parameter
const Template: StoryFn<RequestFailedProps> = (args: RequestFailedProps) => {
  const [open, setOpen] = useState(args.open);

  const handleClose = () => {
    setOpen(false);
  };

  return <RequestFailedPopUp open={open} onClose={handleClose} errorText={args.errorText} />;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
  errorText: 'Something went wrong! Please try again later.',
};

export const Closed = Template.bind({});
Closed.args = {
  open: false,
  errorText: 'Error occurred.',
};

export const CustomErrorMessage = Template.bind({});
CustomErrorMessage.args = {
  open: true,
  errorText: 'Unable to fetch data from the server.',
};
